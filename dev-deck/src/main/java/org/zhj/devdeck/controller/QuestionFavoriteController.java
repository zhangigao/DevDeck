package org.zhj.devdeck.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.service.QuestionFavoriteService;
import org.zhj.devdeck.vo.QuestionVO;

/**
 * 题目收藏控制器
 */
@RestController
@RequestMapping("/api/favorites")
@CrossOrigin
public class QuestionFavoriteController {

    @Autowired
    private QuestionFavoriteService questionFavoriteService;

    /**
     * 收藏题目
     */
    @PostMapping("/questions/{questionId}")
    public Result<Void> favoriteQuestion(@PathVariable Integer questionId) {
        // TODO: 从当前登录用户获取用户ID，这里暂时使用固定值1
        Integer currentUserId = 1;
        
        boolean success = questionFavoriteService.favoriteQuestion(currentUserId, questionId);
        if (success) {
            return Result.success();
        } else {
            return Result.error("收藏失败");
        }
    }

    /**
     * 取消收藏题目
     */
    @DeleteMapping("/questions/{questionId}")
    public Result<Void> unfavoriteQuestion(@PathVariable Integer questionId) {
        // TODO: 从当前登录用户获取用户ID，这里暂时使用固定值1
        Integer currentUserId = 1;
        
        boolean success = questionFavoriteService.unfavoriteQuestion(currentUserId, questionId);
        if (success) {
            return Result.success();
        } else {
            return Result.error("取消收藏失败");
        }
    }

    /**
     * 检查是否已收藏
     */
    @GetMapping("/questions/{questionId}/status")
    public Result<Boolean> checkFavoriteStatus(@PathVariable Integer questionId) {
        // TODO: 从当前登录用户获取用户ID，这里暂时使用固定值1
        Integer currentUserId = 1;
        
        boolean isFavorited = questionFavoriteService.isFavorited(currentUserId, questionId);
        return Result.success(isFavorited);
    }

    /**
     * 获取我的收藏题目列表
     */
    @GetMapping("/questions")
    public Result<Page<QuestionVO>> getFavoriteQuestions(QuestionPageRequest request) {
        // TODO: 从当前登录用户获取用户ID，这里暂时使用固定值1
        Integer currentUserId = 1;
        
        Page<QuestionVO> page = questionFavoriteService.getFavoriteQuestions(currentUserId, request);
        return Result.success(page);
    }
} 