package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * 绑定角色权限
 *
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class BindRolePermissionRequest {

    @NotNull(message = "角色ID不能为空")
    private Integer roleId;
    private List<Integer> permissionIds;
    private List<Integer> permissionIdsToDelete;

}
