package org.zhj.devdeck.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.util.Date;

/**
 * @Author 86155
 * @Date 2025/5/24
 */
@Data
public class BaseEntity {

    /**
     * 创建人ID
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer createdBy;

    /**
     * 创建日期时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 修改日期时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    /**
     * 删除日期时间
     */
    @TableLogic(
            value = "null",
            delval = "now()"
    )
    private Date deletedAt;

    /**
     * 修改人ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Integer updatedBy;
}
