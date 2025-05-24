package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 创建角色请求
 *
 * @Author 86155
 * @Date 2025/5/23
 */
@Data
public class CreateRoleRequest {

    /**
     * 名称
     */
    @NotBlank(message = "名称不能为空")
    private String name;
    /**
     * 描述
     */
    @NotBlank(message = "描述不能为空")
    private String description;
}
