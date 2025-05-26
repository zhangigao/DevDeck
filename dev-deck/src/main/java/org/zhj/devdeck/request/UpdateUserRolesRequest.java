package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 更新用户角色请求
 *
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class UpdateUserRolesRequest {

    /**
     * 用户UUID
     */
    @NotBlank(message = "用户UUID不能为空")
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