package org.zhj.devdeck.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 图形验证码传输对象
 *
 * @Author 86155
 * @Date 2025/5/24
 */
@Builder
@Data
public class CaptchaDTO {

    private String code;
    private Long lastTime;
}
