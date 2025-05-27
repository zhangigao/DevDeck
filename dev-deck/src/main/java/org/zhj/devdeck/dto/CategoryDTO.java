package org.zhj.devdeck.dto;

import lombok.Data;

/**
 * 分类数据传输对象
 */
@Data
public class CategoryDTO {
    private Integer id;
    private String name;
    private String slug;
    private Integer parentId;
    private Integer sortWeight;
    private String description;
    private String icon;
    private String isEnabled;
} 