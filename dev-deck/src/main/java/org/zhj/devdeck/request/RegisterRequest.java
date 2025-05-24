package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 注册请求对象
 *
 * @Author 86155
 * @Date 2025/5/19
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "邮箱不能为空")
    private String email;
    @NotBlank(message = "密码不能为空")
    private String password;
    @NotBlank(message = "验证码不能为空")
    private String code;
    private String nickname;
}
