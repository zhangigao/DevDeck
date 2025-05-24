package org.zhj.devdeck.assembles;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.dto.CreatePermissionDTO;
import org.zhj.devdeck.dto.CreateRoleDTO;
import org.zhj.devdeck.vo.PermissionVO;
import org.zhj.devdeck.vo.RoleVO;
import org.zhj.devdeck.vo.UserRoleVO;

/**
 * 后台服务
 */
public interface AdminService {

    String createPermission(CreatePermissionDTO dto);

    IPage<PermissionVO> listPermission(Integer pageNo, Integer pageSize);

    String createRole(CreateRoleDTO dto);

    IPage<RoleVO> listRole(Integer pageNo, Integer pageSize);

    RoleVO getRoleDetail(Integer id);

    String bindRolePermission(BindRolePermissionDTO dto);

    UserRoleVO getUserDetail(String uuid);
}
