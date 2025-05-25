package org.zhj.devdeck.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 角色视图对象
 *
 * @Author 86155
 * @Date 2025/5/23
 */
@Data
public class RoleVO {

    private Integer id;
    private String name;
    private String description;
    private String createdBy;
    private Date createdAt;
    private String updatedBy;
    private Date updatedAt;
    private List<PermissionVO> permissions;

}
