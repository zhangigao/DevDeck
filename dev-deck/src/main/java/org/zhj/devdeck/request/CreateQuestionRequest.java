package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 创建题目请求
 */
@Data
public class CreateQuestionRequest {
    
    @NotBlank(message = "题目标题不能为空")
    private String title;
    
    @NotBlank(message = "题目标识不能为空")
    private String slug;
    
    @NotBlank(message = "题目内容不能为空")
    private String content;
    
    private String answerTemplate;
    
    private Object correctAnswer;
    
    @NotNull(message = "题目类型不能为空")
    private Integer type;
    
    @NotNull(message = "题目难度不能为空")
    private Integer difficulty;
    
    private String hint;
    
    private String source;
    
    private Boolean isOfficial = false;
    
    private Boolean isEnabled = true;
    
    @NotNull(message = "分类ID不能为空")
    private Integer categoryId;
} 