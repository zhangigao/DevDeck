package org.zhj.devdeck.request;

import lombok.Data;

/**
 * 图形验证码请求对象
 *
 * @Author 86155
 * @Date 2025/5/18
 */
@Data
public class CaptchaRequest {
    // 验证码唯一标识符
    private String uuid;

}
