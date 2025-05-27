package org.zhj.devdeck.assembles.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.zhj.devdeck.assembles.AdminService;
import org.zhj.devdeck.assembles.enums.RoleEnum;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.dto.CreatePermissionDTO;
import org.zhj.devdeck.dto.CreateRoleDTO;
import org.zhj.devdeck.dto.UpdateUserRolesDTO;
import org.zhj.devdeck.dto.UserPageDTO;
import org.zhj.devdeck.model.*;
import org.zhj.devdeck.service.*;
import org.zhj.devdeck.vo.PermissionVO;
import org.zhj.devdeck.vo.RoleVO;
import org.zhj.devdeck.vo.UserDetailVO;
import org.zhj.devdeck.vo.UserVO;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Author 86155
 * @Date 2025/5/23
 */
@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    // 缓存管理员角色
    private static final Integer DEFAULT_USER_TOTAL = 10;
    private static final Map<Integer, User> ADMIN_ROLES = new ConcurrentHashMap<>(DEFAULT_USER_TOTAL);
    private final PermissionService permissionService;
    private final RoleService roleService;
    private final UsersService usersService;
    private final RolePermissionsService rolePermissionsService;
    private final UserRolesService userRolesService;

    AdminServiceImpl(PermissionService permissionService, RoleService roleService, UserRolesService userRolesService, UsersService usersService, RolePermissionsService rolePermissionsService) {
        this.permissionService = permissionService;
        this.roleService = roleService;
        this.usersService = usersService;
        this.rolePermissionsService = rolePermissionsService;
        this.userRolesService = userRolesService;
        LambdaQueryWrapper<UserRoles> wrapper = new LambdaQueryWrapper<>();
        List<User> userList = usersService.getUserByRoleId(RoleEnum.SYSTEM_ADMIN.getCode(), DEFAULT_USER_TOTAL);
        userList.forEach(user -> {
            ADMIN_ROLES.put(user.getId(), user);
        });
    }

    @Override
    public String createPermission(CreatePermissionDTO dto) {
        Permission permission = new Permission();
        BeanUtils.copyProperties(dto,permission);
        if (permissionService.save(permission)) {
            return "创建成功";
        }
        return "创建失败，请联系管理员";
    }

    @Override
    public IPage<PermissionVO> listPermission(Integer pageNo, Integer pageSize) {
        if (pageNo == null || pageNo < 1) {
            pageNo = 1;
        }
        if (pageSize == null || pageSize < 1 || pageSize > 100) {
            pageSize = 10;
        }
        Page<Permission> page = new Page<>(pageNo, pageSize);
        permissionService.page(page, null);
        return page.convert(Permission -> {
            PermissionVO vo = new PermissionVO();
            BeanUtils.copyProperties(Permission, vo);
            User cu = ADMIN_ROLES.get(Permission.getCreatedBy());
            User uu = ADMIN_ROLES.get(Permission.getUpdatedBy());
            if(Objects.nonNull(cu)) {
                vo.setCreatedBy(cu.getNickname());
                vo.setUpdatedBy(uu.getNickname());
                return vo;
            }
            Set<Integer> ids = new HashSet<>();
            ids.add(Permission.getCreatedBy());
            ids.add(Permission.getUpdatedBy());
            List<User> users = usersService.listByIds(ids);
            users.forEach(user -> {
                if(user.getId().equals(Permission.getCreatedBy())) {
                    vo.setCreatedBy(user.getNickname());
                }
                if(user.getId().equals(Permission.getUpdatedBy())) {
                    vo.setUpdatedBy(user.getNickname());
                }
            });
            return vo;
        });
    }

    @Override
    public String createRole(CreateRoleDTO dto) {
        Role role = new Role();
        BeanUtils.copyProperties(dto, role);
        if (roleService.save(role)) {
            return "创建成功";
        }
        return "创建失败，请联系管理员";
    }

    @Override
    public IPage<RoleVO> listRole(Integer pageNo, Integer pageSize) {
        if(pageNo == null || pageNo < 1) {
            pageNo = 1;
        }
        if(pageSize == null || pageSize < 1 || pageSize > 100) {
            pageSize = 10;
        }
        Page<Role> page = new Page<>(pageNo, pageSize);
        roleService.page(page);
        return page.convert(role -> {
            // 直接调用getRoleDetail获取完整的角色信息（包含权限）
            return roleService.getRoleDetail(role.getId());
        });
    }

    @Override
    public RoleVO getRoleDetail(Integer id) {
        return roleService.getRoleDetail(id);
    }

    @Override
    public String bindRolePermission(BindRolePermissionDTO dto) {
        List<Integer> permissionIds = dto.getPermissionIds();
        if(!CollectionUtils.isEmpty(permissionIds)) {
            List<RolePermissions> rolePermissions = permissionIds.stream().map(permissionId -> {
                RolePermissions rolePermission = new RolePermissions();
                rolePermission.setRoleId(dto.getRoleId());
                rolePermission.setPermissionId(permissionId);
                return rolePermission;
            }).toList();
            rolePermissionsService.saveOrUpdateBatch(rolePermissions);
        }
        if(!CollectionUtils.isEmpty(dto.getPermissionIdsToDelete())) {
            rolePermissionsService.deletePermission(dto);
        }
        return "操作成功";
    }

    @Override
    public String deleteRole(Integer id) {
        // 先删除角色权限关联
        LambdaQueryWrapper<RolePermissions> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermissions::getRoleId, id);
        rolePermissionsService.remove(wrapper);
        
        // 删除角色
        if (roleService.removeById(id)) {
            return "删除成功";
        }
        return "删除失败，请联系管理员";
    }

    @Override
    public UserDetailVO getUserDetail(String uuid) {
        return usersService.getUserDetail(uuid);
    }

    @Override
    public IPage<UserVO> listUser(UserPageDTO dto) {
        return usersService.voPage(dto);
    }

    @Override
    public String updateUserRoles(UpdateUserRolesDTO dto) {
        // 根据UUID获取用户ID
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUuid, dto.getUserUuid());
        User user = usersService.getOne(userWrapper);
        
        if (user == null) {
            return "用户不存在";
        }
        
        Integer userId = user.getId();
        
        // 删除指定的角色
        if (!CollectionUtils.isEmpty(dto.getRoleIdsToDelete())) {
            LambdaQueryWrapper<UserRoles> deleteWrapper = new LambdaQueryWrapper<>();
            deleteWrapper.eq(UserRoles::getUserId, userId);
            deleteWrapper.in(UserRoles::getRoleId, dto.getRoleIdsToDelete());
            userRolesService.remove(deleteWrapper);
        }
        
        // 添加新角色
        if (!CollectionUtils.isEmpty(dto.getRoleIds())) {
            List<UserRoles> userRolesList = dto.getRoleIds().stream().map(roleId -> {
                UserRoles userRoles = new UserRoles();
                userRoles.setUserId(userId);
                userRoles.setRoleId(roleId);
                return userRoles;
            }).toList();
            userRolesService.saveOrUpdateBatch(userRolesList);
        }
        
        return "用户角色更新成功";
    }
}
