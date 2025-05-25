package org.zhj.devdeck.response;

import lombok.Data;

/**
 * 登录响应
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class LoginResponse {

    private Integer id;
    private String token;
    private String uuid;
    private String email;
    private String nickname;
    private String avatarUrl;

}
