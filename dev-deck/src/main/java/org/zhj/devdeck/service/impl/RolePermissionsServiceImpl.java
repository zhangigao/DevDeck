package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.model.RolePermissions;
import org.zhj.devdeck.service.RolePermissionsService;
import org.zhj.devdeck.mapper.RolePermissionsMapper;
import org.springframework.stereotype.Service;

/**
* @author 86155
* @description 针对表【role_permissions】的数据库操作Service实现
* @createDate 2025-05-23 20:52:16
*/
@Service
public class RolePermissionsServiceImpl extends ServiceImpl<RolePermissionsMapper, RolePermissions>
    implements RolePermissionsService{

    @Resource
    private RolePermissionsMapper rolePermissionsMapper;

    @Override
    public void deletePermission(BindRolePermissionDTO dto) {
        rolePermissionsMapper.deletePermissions(dto);
    }
}




