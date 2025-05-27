package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



/**
 * 更新题目请求
 */
@Data
public class UpdateQuestionRequest {
    
    @NotNull(message = "题目ID不能为空")
    private Integer id;
    
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
    
    private Boolean isOfficial;
    
    private Boolean isEnabled;
    
    @NotNull(message = "分类ID不能为空")
    private Integer categoryId;
} 