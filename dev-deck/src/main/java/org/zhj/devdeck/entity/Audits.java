package org.zhj.devdeck.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

/**
 * 
 * @TableName audits
 */
@Data
@TableName(value ="audits")
public class Audits {
    /**
     * 自增主键
     */
    @TableId(value = "audit_id", type = IdType.AUTO)
    private Long auditId;

    /**
     * 审批类型
     */
    private String auditType;

    /**
     * 审批状态
     */
    private String status;

    /**
     * 提交人
     */
    private Long submitUser;

    /**
     * 审核人 0 为系统自动审核
     */
    private Long auditor;

    /**
     * 审批时间
     */
    private Date auditTime;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.UPDATE)
    private Date updatedAt;

}