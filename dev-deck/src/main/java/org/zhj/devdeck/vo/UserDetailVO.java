package org.zhj.devdeck.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 用户角色视图对象
 *
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class UserDetailVO {

    private String uuid;
    private String email;
    private String nickName;
    private String avatarUrl;
    private List<RoleVO> roles;
    private String createdBy;
    private Date createdAt;
    private String updatedBy;
    private Date updatedAt;
}
