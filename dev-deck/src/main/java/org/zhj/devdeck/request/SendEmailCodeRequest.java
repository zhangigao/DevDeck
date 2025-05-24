package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

/**
 * 发送邮箱验证码的请求对象
 *
 * @Author 86155
 * @Date 2025/5/18
 */
@Data
public class SendEmailCodeRequest {

    @NotBlank(message = "邮箱不能为空")
    private String email;

    /**
     * 业务类型
     * 1: 注册
     * 2: 登录
     * 3: 修改密码
     */
    @NotNull(message = "业务类型不能为空")
    @Range(min = 1, max = 3, message = "业务类型取值范围1-3")
    private Integer type;

    @NotBlank(message = "验证码UUID不能为空")
    private String captchaUuid;

    @NotBlank(message = "图形验证码不能为空")
    private String captchaCode;
}
