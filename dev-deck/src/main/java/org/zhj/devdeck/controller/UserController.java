package org.zhj.devdeck.controller;

import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.assembles.UserService;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.dto.RegisterDTO;
import org.zhj.devdeck.entity.User;
import org.zhj.devdeck.enums.ResultCode;
import org.zhj.devdeck.request.*;
import org.zhj.devdeck.response.CaptchaResponse;
import org.zhj.devdeck.response.LoginResponse;
import org.zhj.devdeck.utils.UserContext;

import java.util.Map;

/**
 * 用户行文控制器
 *
 * @Author 86155
 * @Date 2025/5/18
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    /**
     * 获取邮箱验证码
     * @param request
     * @param httpRequest
     * @return
     */
    @PostMapping("/verification-code")
    public Result<String> getVerificationCode(@RequestBody @Valid SendEmailCodeRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        userService.sendVerificationCode(request.getEmail(), request.getCaptchaUuid(), request.getCaptchaCode(),request.getType() , ip);
        return Result.success("验证码发送成功");
    }

    /**
     * 获取图形验证码
     * @return
     */
    @PostMapping("/captcha")
    public Result<CaptchaResponse> getCaptcha(@RequestBody @Valid CaptchaRequest request) {
        return Result.success(userService.generateCaptcha(request.getUuid()));
    }


    @PostMapping("/login")
    public Result<LoginResponse> loginByPassword(@RequestBody @Validated(LoginRequest.PasswordLogin.class) LoginRequest request) {
        LoginResponse response = userService.loginByPassword(request.getEmail(), request.getPassword());
        if (ObjectUtils.isEmpty(request)) {
            return Result.error(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }
        return Result.success(response);
    }

    @PostMapping("/login/code")
    public Result<LoginResponse> loginByCode(@RequestBody @Validated(LoginRequest.CodeLogin.class) LoginRequest request) {
        LoginResponse response = userService.loginByCode(request.getEmail(), request.getCode());
        if (ObjectUtils.isEmpty(response)) {
            return Result.error(ResultCode.EMAIL_NOT_REGISTERED);
        }
        return Result.success(response);
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody @Valid RegisterRequest request) {
        RegisterDTO registerDTO = new RegisterDTO();
        BeanUtils.copyProperties(request, registerDTO);
        return Result.success(userService.register(registerDTO));
    }

    @GetMapping("/logout")
    public Result<String> logout() {
        Integer uid = UserContext.require().getId();
        userService.logout(uid);
        return Result.success("注销成功");
    }

    @PutMapping("/password")
    public Result<String> updatePassword(@RequestBody @Validated(UserUpdateRequest.Password.class) UserUpdateRequest request) {
        userService.updatePassword(request.getOldPassword(), request.getNewPassword());
        return Result.success("修改密码成功");
    }

    @GetMapping("/upload-token")
    public Result<String> getUploadToken() {
        String uuid = UserContext.require().getUuid();
        return Result.success(userService.uploadToken(uuid));
    }

    @PostMapping("/update-avatar")
    public Result<String> updateAvatar(@RequestBody @Validated(UserUpdateRequest.Avatar.class) UserUpdateRequest request) {
        User user = UserContext.require();
        user.setAvatarUrl(request.getAvatarUrl());
        userService.updateAvatar(user);
        return Result.success("头像更新成功");
    }

    @PutMapping("/nickname")
    public Result<String> updateUser(@RequestBody @Validated(UserUpdateRequest.Nickname.class) UserUpdateRequest request) {
        User user = UserContext.require();
        user.setNickname(request.getNickname());
        userService.updateNickname(user);
        return Result.success("用户信息更新成功");
    }

    @GetMapping("/current")
    public Result<LoginResponse> getCurrentUser() {
        User user = UserContext.require();
        LoginResponse response = new LoginResponse();
        BeanUtils.copyProperties(user, response);
        return Result.success(response);
    }

    /** 获取客户端IP
     * @param request
     * @return */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 对于通过多个代理的情况，第一个IP为客户端真实IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
