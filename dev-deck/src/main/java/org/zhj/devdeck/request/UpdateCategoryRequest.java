package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



/**
 * 更新分类请求
 */
@Data
public class UpdateCategoryRequest {
    
    @NotNull(message = "分类ID不能为空")
    private Integer id;
    
    @NotBlank(message = "分类名称不能为空")
    private String name;
    
    @NotBlank(message = "分类标识不能为空")
    private String slug;
    
    private Integer parentId;
    
    @NotNull(message = "排序权重不能为空")
    private Integer sortWeight;
    
    private String description;
    
    private String icon;
    
    private String isEnabled;
} 