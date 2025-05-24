package org.zhj.devdeck.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建权限
 * @Author 86155
 * @Date 2025/5/23
 */
@Data
public class CreatePermissionDTO {

    /**
     * 权限名称
     */
    private String name;
    /**
     * 权限码
    */
    private String code;
    /**
     * 权限描述
     */
    private String description;
}
