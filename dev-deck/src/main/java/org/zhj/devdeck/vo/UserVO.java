package org.zhj.devdeck.vo;

import lombok.Data;

/**
 * 用户信息
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class UserVO {

    private String uuid;
    private String email;
    private String nickName;
    private String avatarUrl;
    private RoleVO role;
}
