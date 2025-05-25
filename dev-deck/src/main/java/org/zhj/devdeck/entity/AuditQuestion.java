package org.zhj.devdeck.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @TableName audit_question
 */
@EqualsAndHashCode(callSuper = true)
@TableName(value ="audit_question")
@Data
public class AuditQuestion extends Audits{

    /**
     * 题目ID
     */
    private Long questionId;

    /**
     * 题目内容
     */
    private Object content;

    /**
     * 版本号
     */
    private Integer revision;

}