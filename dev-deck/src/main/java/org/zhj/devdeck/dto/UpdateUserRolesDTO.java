package org.zhj.devdeck.dto;

import lombok.Data;

import java.util.List;

/**
 * 更新用户角色DTO
 *
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class UpdateUserRolesDTO {

    /**
     * 用户UUID
     */
    private String userUuid;

    /**
     * 新角色ID列表
     */
    private List<Integer> roleIds;

    /**
     * 需要删除的角色ID列表
     */
    private List<Integer> roleIdsToDelete;
} 