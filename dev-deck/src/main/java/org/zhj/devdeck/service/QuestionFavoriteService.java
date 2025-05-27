package org.zhj.devdeck.service;

import org.zhj.devdeck.model.QuestionFavorite;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.vo.QuestionVO;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * @author 86155
 * @description 针对表【question_favorite】的数据库操作Service
 */
public interface QuestionFavoriteService extends IService<QuestionFavorite> {

    /**
     * 收藏题目
     */
    boolean favoriteQuestion(Integer userId, Integer questionId);

    /**
     * 取消收藏题目
     */
    boolean unfavoriteQuestion(Integer userId, Integer questionId);

    /**
     * 检查是否已收藏
     */
    boolean isFavorited(Integer userId, Integer questionId);

    /**
     * 获取用户收藏的题目列表
     */
    Page<QuestionVO> getFavoriteQuestions(Integer userId, QuestionPageRequest request);
} 