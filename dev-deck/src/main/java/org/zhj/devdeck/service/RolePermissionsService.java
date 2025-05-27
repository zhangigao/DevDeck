package org.zhj.devdeck.service;

import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.model.RolePermissions;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author 86155
* @description 针对表【role_permissions】的数据库操作Service
* @createDate 2025-05-23 20:52:16
*/
public interface RolePermissionsService extends IService<RolePermissions> {

    void deletePermission(BindRolePermissionDTO dto);
}
