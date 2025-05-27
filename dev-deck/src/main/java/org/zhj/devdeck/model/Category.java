package org.zhj.devdeck.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 
 * @TableName category
 */
@TableName(value ="category")
@Data
public class Category extends BaseEntity{
    /**
     * 自增主键
     */
    @TableId(value = "id",type = IdType.AUTO)
    private Integer id;

    /**
     * 分类名称（如“后端开发”）
     */
    private String name;

    /**
     * 分类英文标识（URL友好，如“fontend”）
     */
    private String slug;

    /**
     * 负分类ID
     */
    private Integer parentId;

    /**
     * 排序权重
     */
    private Integer sortWeight;

    /**
     * 分类描述
     */
    private String description;

    /**
     * 分类图标
     */
    private String icon;

    /**
     * 是否启用
     */
    private String isEnabled;

}