package org.zhj.devdeck.entity;

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
    private Integer createdBy;

    /**
     * 创建日期时间
     */
    private Date createdAt;

    /**
     * 修改日期时间
     */
    private Date updatedAt;

    /**
     * 删除日期时间
     */
    private Date deletedAt;

    /**
     * 修改人ID
     */
    private Integer updatedBy;
}
