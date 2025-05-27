package org.zhj.devdeck.dto;

import lombok.Data;

/**
 * 题目数据传输对象
 */
@Data
public class QuestionDTO {
    private Integer id;
    private String uuid;
    private String title;
    private String slug;
    private String content;
    private String answerTemplate;
    private Object correctAnswer;
    private Integer type;
    private Integer difficulty;
    private Integer submitCount;
    private String hint;
    private String source;
    private Boolean isOfficial;
    private Boolean isEnabled;
    private Integer categoryId;
} 