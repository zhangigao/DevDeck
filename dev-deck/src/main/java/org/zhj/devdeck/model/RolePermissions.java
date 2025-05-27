package org.zhj.devdeck.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 
 * @TableName role_permissions
 */
@TableName(value ="role_permissions")
@Data
public class RolePermissions extends BaseEntity{
    /**
     * 自增主键
     */
    @TableId(value = "id",type = IdType.AUTO)
    private Integer id;

    /**
     * 角色ID
     */
    private Integer roleId;

    /**
     * 权限ID
     */
    private Integer permissionId;

}