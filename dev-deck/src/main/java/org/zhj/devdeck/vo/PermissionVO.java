package org.zhj.devdeck.vo;

import lombok.Data;

import java.util.Date;

/**
 * 权限视图对象
 *
 * @Author 86155
 * @Date 2025/5/23
 */
@Data
public class PermissionVO {

    private Integer id;
    private String name;
    private String code;
    private String description;
    private String createdBy;
    private String updatedBy;
    private Date createdAt;
    private Date updatedAt;
}
