package org.zhj.devdeck.request;

import lombok.Data;

/**
 * 题目分页查询请求
 */
@Data
public class QuestionPageRequest {
    
    private Integer page = 1;
    
    private Integer size = 10;
    
    private String title;
    
    private Integer categoryId;
    
    private Integer type;
    
    private Integer difficulty;
    
    private Boolean isOfficial;
    
    private Boolean isEnabled;
    
    private String sortBy = "createdAt";
    
    private String sortOrder = "desc";
} 