package org.zhj.devdeck.controller;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zhj.devdeck.assembles.UserService;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.dto.RegisterDTO;
import org.zhj.devdeck.enums.ResultCode;
import org.zhj.devdeck.request.CaptchaRequest;
import org.zhj.devdeck.request.LoginRequest;
import org.zhj.devdeck.request.RegisterRequest;
import org.zhj.devdeck.request.SendEmailCodeRequest;
import org.zhj.devdeck.response.CaptchaResponse;

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
    public Result<Map<String,String>> loginByPassword(@RequestBody @Validated(LoginRequest.PasswordLogin.class) LoginRequest request) {
        String token = userService.loginByPassword(request.getEmail(), request.getPassword());
        if (StringUtils.isEmpty(token)) {
            return Result.error(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }
        return Result.success(Map.of("token",token),"登录成功");
    }

    @PostMapping("/login/code")
    public Result<Map<String,String>> loginByCode(@RequestBody @Validated(LoginRequest.CodeLogin.class) LoginRequest request) {
        String token = userService.loginByCode(request.getEmail(), request.getCode());
        if (StringUtils.isEmpty(token)) {
            return Result.error(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }
        return Result.success(Map.of("token",token),"登录成功");
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody @Valid RegisterRequest request) {
        RegisterDTO registerDTO = new RegisterDTO();
        BeanUtils.copyProperties(request, registerDTO);
        return Result.success(userService.register(registerDTO));
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
