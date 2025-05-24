package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 新建权限请求
 * @Author 86155
 * @Date 2025/5/23
 */
@Data
public class CreatePermissionRequest {

    /**
     * 权限名称
     */
    @NotBlank(message = "权限名称不能为空")
    private String name;
    /**
     * 权限码
     */
    @NotBlank(message = "权限码不能为空")
    private String code;
    /**
     * 权限描述
     */
    @NotBlank(message = "权限描述不能为空")
    private String description;
}