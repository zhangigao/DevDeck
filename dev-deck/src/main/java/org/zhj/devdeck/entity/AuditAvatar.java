package org.zhj.devdeck.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @TableName audit_avatar
 */
@Data
@TableName(value ="audit_avatar")
@EqualsAndHashCode(callSuper = true)
public class AuditAvatar extends Audits{

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 头像Hash
     */
    private String originalHash;

}