package org.zhj.devdeck.assembles.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
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
import org.zhj.devdeck.response.LoginResponse;
import org.zhj.devdeck.service.impl.QiniuService;
import org.zhj.devdeck.utils.AbstractNameGenerator;
import org.zhj.devdeck.utils.EncryptUtils;
import org.zhj.devdeck.utils.JwtUtils;
import org.zhj.devdeck.utils.UserContext;

import java.util.Date;
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
    private final StringRedisTemplate redisTemplate;
    private final QiniuService qiNiuService;


    public boolean existsByEmail(String email) {
        return userMapper.selectCount(Wrappers.<User>lambdaQuery().eq(User::getEmail, email)) > 0;
    }

    @Override
    public void sendVerificationCode(String email, String captchaUuid, String captchaCode, Integer type, String ip) {
        if (type == 1 && existsByEmail(email)) {
            throw new QuizException("邮箱已经被注册过");
        } else if ((type == 2 || type == 3 ) && !existsByEmail(email)) {
            throw new QuizException("邮箱没有注册过");
        }
        verifyService.generateAndSendCode(email, captchaUuid, captchaCode, type, ip);
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
    public LoginResponse loginByPassword(String email, String password) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        User user = usersMapper.selectOne(wrapper.eq(User::getEmail, email));
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        boolean flag = user.getPassword().equals(EncryptUtils.encrypt(password));
        if (!flag) {
            return null;
        }
        UserContext.set(user);
        String token = JwtUtils.generateToken(user);
        redisTemplate.opsForValue().set(RedisConstant.TOKEN_PREFIX + user.getId(), token,
                RedisConstant.TOKEN_EXPIRE, TimeUnit.SECONDS);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        BeanUtils.copyProperties(user, response);
        User updateLoginDate = new User();
        updateLoginDate.setId(user.getId());
        updateLoginDate.setUpdatedAt(new Date());
        userMapper.updateById(updateLoginDate);
        return response;
    }

    @Override
    public LoginResponse loginByCode(String email, String code) {
        if (verifyService.verifyCode(email, code)) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            User user = usersMapper.selectOne(wrapper.eq(User::getEmail, email));
            if (ObjectUtils.isEmpty(user)) {
                return null;
            }
            String token = JwtUtils.generateToken(user);
            redisTemplate.opsForValue().set(RedisConstant.TOKEN_PREFIX + user.getId(), token,
                    RedisConstant.TOKEN_EXPIRE, TimeUnit.SECONDS);
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            BeanUtils.copyProperties(user, response);
            User updateLoginDate = new User();
            updateLoginDate.setId(user.getId());
            updateLoginDate.setUpdatedAt(new Date());
            userMapper.updateById(updateLoginDate);
            return response;
        }
        return null;
    }

    @Override
    public void logout(Integer uid) {
        redisTemplate.delete(RedisConstant.TOKEN_PREFIX + uid);
    }

    @Override
    public void updatePassword(String oldPassword, String newPassword) {
        User user = UserContext.require();
        if (!user.getPassword().equals(EncryptUtils.encrypt(oldPassword))) {
            throw new QuizException(400, "旧密码错误");
        }
        user.setPassword(EncryptUtils.encrypt(newPassword));
        userMapper.updateById(user);
    }

    @Override
    public String uploadToken(String uuid) {
        return qiNiuService.uploadToken(null);
    }

    @Override
    public void updateAvatar(User user) {
        userMapper.updateById(user);
    }

    @Override
    public void updateNickname(User user) {
        userMapper.updateById(user);
    }
}
