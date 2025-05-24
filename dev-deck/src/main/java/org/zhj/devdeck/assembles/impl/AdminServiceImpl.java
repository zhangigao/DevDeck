package org.zhj.devdeck.assembles.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.zhj.devdeck.assembles.AdminService;
import org.zhj.devdeck.assembles.UserService;
import org.zhj.devdeck.assembles.enums.RoleEnum;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.dto.CreatePermissionDTO;
import org.zhj.devdeck.dto.CreateRoleDTO;
import org.zhj.devdeck.entity.*;
import org.zhj.devdeck.exception.QuizException;
import org.zhj.devdeck.service.*;
import org.zhj.devdeck.vo.PermissionVO;
import org.zhj.devdeck.vo.RoleVO;
import org.zhj.devdeck.vo.UserRoleVO;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

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

    AdminServiceImpl(PermissionService permissionService, RoleService roleService, UserRolesService userRolesService, UsersService usersService, RolePermissionsService rolePermissionsService) {
        this.permissionService = permissionService;
        this.roleService = roleService;
        this.usersService = usersService;
        this.rolePermissionsService = rolePermissionsService;
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
            Set<Integer> ids = Set.of(Permission.getCreatedBy(), Permission.getUpdatedBy());
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
            RoleVO vo = new RoleVO();
            BeanUtils.copyProperties(role, vo);
            User cu = ADMIN_ROLES.get(role.getCreatedBy());
            User uu = ADMIN_ROLES.get(role.getUpdatedBy());
            if(Objects.nonNull(cu)) {
                vo.setCreatedBy(cu.getNickname());
                vo.setUpdatedBy(uu.getNickname());
                return vo;
            }
            Set<Integer> ids = Set.of(role.getCreatedBy(), role.getUpdatedBy());
            List<User> users = usersService.listByIds(ids);
            users.forEach(user -> {
                if(user.getId().equals(role.getCreatedBy())) {
                    vo.setCreatedBy(user.getNickname());
                }
                if(user.getId().equals(role.getUpdatedBy())) {
                    vo.setUpdatedBy(user.getNickname());
                }
            });
            return vo;
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
            LambdaQueryWrapper<RolePermissions> wrapper = new LambdaQueryWrapper<>();
            wrapper.in(RolePermissions::getPermissionId, dto.getPermissionIdsToDelete());
            wrapper.eq(RolePermissions::getRoleId, dto.getRoleId());
            rolePermissionsService.remove(wrapper);
        }
        return "操作成功";
    }

    @Override
    public UserRoleVO getUserDetail(String uuid) {

        return null;
    }
}
