package org.zhj.devdeck.assembles.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.zhj.devdeck.assembles.UserService;
import org.zhj.devdeck.constant.RedisConstant;
import org.zhj.devdeck.dto.RegisterDTO;
import org.zhj.devdeck.entity.User;
import org.zhj.devdeck.enums.ResultCode;
import org.zhj.devdeck.exception.QuizException;
import org.zhj.devdeck.mapper.UserMapper;
import org.zhj.devdeck.response.CaptchaResponse;
import org.zhj.devdeck.service.EmailService;
import org.zhj.devdeck.utils.AbstractNameGenerator;
import org.zhj.devdeck.utils.EncryptUtils;
import org.zhj.devdeck.utils.JwtUtils;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * @Author 86155
 * @Date 2025/5/18
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserMapper usersMapper;
    private final UserMapper userMapper;
    private final VerifyService verifyService;
    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;


    public boolean existsByEmail(String email) {
        return userMapper.selectCount(Wrappers.<User>lambdaQuery().eq(User::getEmail, email)) > 0;
    }

    @Override
    public void sendVerificationCode(String email, String captchaUuid, String captchaCode, Integer type, String ip) {
        if (type == 1 && existsByEmail(email)) {
            throw new QuizException("邮箱已经被注册过");
        }
        String code = verifyService.generateAndSendCode(email, captchaUuid, captchaCode, type, ip);
        log.info("邮箱验证码：{}", code);
        emailService.sendVerificationCode(email, code);
    }

    @Override
    public CaptchaResponse generateCaptcha(String uuid) {
        return verifyService.generateCaptcha(uuid);
    }

    @Override
    public String register(RegisterDTO dto) {
        if (existsByEmail(dto.getEmail())) {
            throw new QuizException(400, "邮箱已经被注册过");
        }
        if (!verifyService.verifyCode(dto.getEmail(), dto.getCode())) {
            throw new QuizException(400, "验证码错误");
        }
        User userEntity = new User();
        AbstractNameGenerator abstractNameGenerator = new AbstractNameGenerator();
        userEntity.setEmail(dto.getEmail());
        userEntity.setUuid(UUID.randomUUID().toString());
        userEntity.setPassword(EncryptUtils.encrypt(dto.getPassword()));
        userEntity.setNickname(dto.getNickname() != null ? dto.getNickname() : abstractNameGenerator.generate());
        usersMapper.insert(userEntity);
        return ResultCode.SUCCESS.getMessage();
    }

    @Override
    public String loginByPassword(String email, String password) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        User user = usersMapper.selectOne(wrapper.eq(User::getEmail, email));
        if (ObjectUtils.isEmpty(user)) {
            return "";
        }
        boolean flag = user.getPassword().equals(EncryptUtils.encrypt(password));
        if (!flag) {
            return "";
        }
        String token = JwtUtils.generateToken(user);
        redisTemplate.opsForValue().set(RedisConstant.TOKEN_PREFIX + user.getId(), token,
                RedisConstant.TOKEN_EXPIRE, TimeUnit.SECONDS);
        return token;
    }

    @Override
    public String loginByCode(String email, String code) {
        if (verifyService.verifyCode(email, code)) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            User user = usersMapper.selectOne(wrapper.eq(User::getEmail, email));
            if (ObjectUtils.isEmpty(user)) {
                return "";
            }
            String token = JwtUtils.generateToken(user);
            redisTemplate.opsForValue().set(RedisConstant.TOKEN_PREFIX + user.getId(), token,
                    RedisConstant.TOKEN_EXPIRE, TimeUnit.SECONDS);
        }
        return "";
    }


}
