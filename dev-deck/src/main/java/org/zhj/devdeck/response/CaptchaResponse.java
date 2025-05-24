package org.zhj.devdeck.response;

import lombok.Builder;
import lombok.Data;

/**
 * @Author 86155
 * @Date 2025/5/24
 */
@Builder
@Data
public class CaptchaResponse {

    private  String uuid;
    private  String imageBase64;
}
