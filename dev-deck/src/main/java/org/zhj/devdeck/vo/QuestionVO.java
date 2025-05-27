package org.zhj.devdeck.vo;

import lombok.Data;

import java.util.Date;

/**
 * 题目视图对象
 */
@Data
public class QuestionVO {
    private Integer id;
    private String uuid;
    private String title;
    private String slug;
    private String content;
    private String answerTemplate;
    private Object correctAnswer;
    private Integer type;
    private String typeName;
    private Integer difficulty;
    private String difficultyName;
    private Integer submitCount;
    private String hint;
    private String source;
    private Boolean isOfficial;
    private Boolean isEnabled;
    private Integer categoryId;
    private String categoryName;
    private Date createdAt;
    private Date updatedAt;
    
    // 选项数据，用于单选和多选题
    private String choices;
} 