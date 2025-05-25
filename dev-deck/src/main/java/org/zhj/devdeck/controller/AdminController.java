package org.zhj.devdeck.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.assembles.AdminService;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.dto.BindRolePermissionDTO;
import org.zhj.devdeck.dto.CreatePermissionDTO;
import org.zhj.devdeck.dto.CreateRoleDTO;
import org.zhj.devdeck.dto.UserPageDTO;
import org.zhj.devdeck.request.BindRolePermissionRequest;
import org.zhj.devdeck.request.CreatePermissionRequest;
import org.zhj.devdeck.request.CreateRoleRequest;
import org.zhj.devdeck.request.UserPageRequest;
import org.zhj.devdeck.vo.PermissionVO;
import org.zhj.devdeck.vo.RoleVO;
import org.zhj.devdeck.vo.UserDetailVO;
import org.zhj.devdeck.vo.UserVO;

/**
 * 后台管理控制器
 *
 * @Author 86155
 * @Date 2025/5/23
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Resource
    private AdminService adminService;

    @PostMapping("/permission")
    public Result<String> createPermission(@RequestBody CreatePermissionRequest request) {
        CreatePermissionDTO dto = new CreatePermissionDTO();
        BeanUtils.copyProperties(request,dto);
        return Result.success(adminService.createPermission(dto));
    }

    @GetMapping("/permission/list")
    public Result<IPage<PermissionVO>> listPermission(@RequestParam Integer pageNo,
                                                    @RequestParam Integer pageSize) {
        return Result.success(adminService.listPermission(pageNo,pageSize));
    }

    @PostMapping("/role")
    public Result<String> createRole(@RequestBody CreateRoleRequest request) {
        CreateRoleDTO dto = new CreateRoleDTO();
        BeanUtils.copyProperties(request,dto);
        return Result.success(adminService.createRole(dto));
    }

    @GetMapping("/role/list")
    public Result<IPage<RoleVO>> listRole(@RequestParam Integer pageNo,
                                           @RequestParam Integer pageSize) {
        return Result.success(adminService.listRole(pageNo,pageSize));
    }

    @GetMapping("/role/{id}")
    public Result<RoleVO> getRoleDetail(@PathVariable("id") Integer id) {
        return Result.success(adminService.getRoleDetail(id));
    }

    @PostMapping("/role/permission")
    public Result<String> updateRole(@RequestBody BindRolePermissionRequest request) {
        BindRolePermissionDTO dto = new BindRolePermissionDTO();
        BeanUtils.copyProperties(request,dto);
        return Result.success(adminService.bindRolePermission(dto));
    }

    @GetMapping("/user/{uuid}")
    public Result<UserDetailVO> getUser(@PathVariable("uuid") String uuid) {
        return Result.success(adminService.getUserDetail(uuid));
    }

    @PostMapping("/user/list")
    public Result<IPage<UserVO>> listUser(@RequestBody UserPageRequest request) {
        UserPageDTO dto = new UserPageDTO();
        BeanUtils.copyProperties(request,dto);
        return Result.success(adminService.listUser(dto));
    }
}
