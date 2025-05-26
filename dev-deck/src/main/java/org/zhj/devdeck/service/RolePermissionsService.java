package org.zhj.devdeck.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.entity.RolePermissions;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author 86155
* @description 针对表【role_permissions】的数据库操作Service
* @createDate 2025-05-23 20:52:16
*/
public interface RolePermissionsService extends IService<RolePermissions> {

    void deletePermission(BindRolePermissionDTO dto);
}
