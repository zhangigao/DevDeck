package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录请求对象
 *
 * @Author 86155
 * @Date 2025/5/19
 */
@Data
public class LoginRequest {

    public interface PasswordLogin {}
    public interface CodeLogin {}

    @NotBlank(message = "邮箱不能为空", groups = {
            PasswordLogin.class,
            CodeLogin.class
    })
    private String email;
    @NotBlank(message = "密码不能为空", groups = PasswordLogin.class)
    private String password;
    @NotBlank(message = "验证码不能为空", groups = CodeLogin.class)
    private String code;

}
