package org.zhj.devdeck.dto;

import lombok.Data;

import java.util.List;

/**
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class BindRolePermissionDTO {

    private Integer roleId;
    private List<Integer> permissionIds;
    private List<Integer> permissionIdsToDelete;
}
