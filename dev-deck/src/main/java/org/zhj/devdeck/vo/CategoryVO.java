package org.zhj.devdeck.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 分类视图对象
 */
@Data
public class CategoryVO {
    private Integer id;
    private String name;
    private String slug;
    private Integer parentId;
    private Integer sortWeight;
    private String description;
    private String icon;
    private String isEnabled;
    private Date createdAt;
    private Date updatedAt;
    private List<CategoryVO> children;
    private Integer questionCount;
} 