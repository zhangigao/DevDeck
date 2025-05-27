package org.zhj.devdeck.model;

import com.baomidou.mybatisplus.annotation.*;

import lombok.Data;

/**
 * 
 * @TableName question
 */
@TableName(value ="question")
@Data
public class Question extends BaseEntity{
    /**
     * 自增主键
     */
    @TableId(value = "id",type = IdType.AUTO)
    private Integer id;

    /**
     * 对外暴露，防爬
     */
    @TableField(value = "uuid", fill = FieldFill.INSERT)
    private String uuid;

    /**
     * 题目标题
     */
    private String title;

    /**
     * URL 友好标识
     */
    private String slug;

    /**
     * 题目描述
     */
    private String content;

    /**
     * 答案模板
     */
    private String answerTemplate;

    /**
     * 正确答案
     */
    private Object correctAnswer;

    /**
     * 选项数据 (JSON格式，用于单选和多选题)
     */
    private String choices;

    /**
     * 题型 （1=单选，2=多选，3=填空，4=编程，5=设计题，6=问答题）
     */
    private Integer type;

    /**
     * 难道 （1=简单，2=中等，3=困难，4=地狱）
     */
    private Integer difficulty;

    /**
     * 提交次数
     */
    private Integer submitCount;

    /**
     * 解题提示
     */
    private String hint;

    /**
     * 题目来源
     */
    private String source;

    /**
     * 是否官方题目
     */
    private Boolean isOfficial;

    /**
     * 是否启用
     */
    private Boolean isEnabled;

    /**
     * 分类ID
     */
    private Integer categoryId;

}