package org.zhj.devdeck.mapper;

import org.apache.ibatis.annotations.Param;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.entity.RolePermissions;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
* @author 86155
* @description 针对表【role_permissions】的数据库操作Mapper
* @createDate 2025-05-23 20:52:16
* @Entity org.zhj.devdeck.entity.RolePermissions
*/
public interface RolePermissionsMapper extends BaseMapper<RolePermissions> {

    void deletePermissions(@Param("dto") BindRolePermissionDTO dto);
}




