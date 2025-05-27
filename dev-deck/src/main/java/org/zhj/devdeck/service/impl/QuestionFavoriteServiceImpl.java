package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.zhj.devdeck.mapper.QuestionFavoriteMapper;
import org.zhj.devdeck.model.Question;
import org.zhj.devdeck.model.QuestionFavorite;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.service.QuestionFavoriteService;
import org.zhj.devdeck.service.QuestionService;
import org.zhj.devdeck.vo.QuestionVO;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author 86155
 * @description 针对表【question_favorite】的数据库操作Service实现
 */
@Service
public class QuestionFavoriteServiceImpl extends ServiceImpl<QuestionFavoriteMapper, QuestionFavorite>
        implements QuestionFavoriteService {

    @Autowired
    private QuestionService questionService;

    @Override
    public boolean favoriteQuestion(Integer userId, Integer questionId) {
        // 检查是否已经收藏
        if (isFavorited(userId, questionId)) {
            return true;
        }

        QuestionFavorite favorite = new QuestionFavorite();
        favorite.setUserId(userId);
        favorite.setQuestionId(questionId);
        
        return save(favorite);
    }

    @Override
    public boolean unfavoriteQuestion(Integer userId, Integer questionId) {
        LambdaQueryWrapper<QuestionFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(QuestionFavorite::getUserId, userId)
               .eq(QuestionFavorite::getQuestionId, questionId);
        
        return remove(wrapper);
    }

    @Override
    public boolean isFavorited(Integer userId, Integer questionId) {
        LambdaQueryWrapper<QuestionFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(QuestionFavorite::getUserId, userId)
               .eq(QuestionFavorite::getQuestionId, questionId);
        
        return count(wrapper) > 0;
    }

    @Override
    public Page<QuestionVO> getFavoriteQuestions(Integer userId, QuestionPageRequest request) {
        // 先获取用户收藏的题目ID列表
        LambdaQueryWrapper<QuestionFavorite> favoriteWrapper = new LambdaQueryWrapper<>();
        favoriteWrapper.eq(QuestionFavorite::getUserId, userId)
                      .orderByDesc(QuestionFavorite::getCreatedAt);
        
        List<QuestionFavorite> favorites = list(favoriteWrapper);
        
        if (favorites.isEmpty()) {
            // 如果没有收藏，返回空页面
            Page<QuestionVO> emptyPage = new Page<>(request.getPage(), request.getSize());
            emptyPage.setTotal(0);
            emptyPage.setRecords(List.of());
            return emptyPage;
        }

        // 获取收藏的题目ID列表
        List<Integer> questionIds = favorites.stream()
                .map(QuestionFavorite::getQuestionId)
                .collect(Collectors.toList());

        // 查询题目详情
        Page<Question> page = new Page<>(request.getPage(), request.getSize());
        LambdaQueryWrapper<Question> questionWrapper = new LambdaQueryWrapper<>();
        questionWrapper.in(Question::getId, questionIds);
        
        // 条件查询
        if (StringUtils.hasText(request.getTitle())) {
            questionWrapper.like(Question::getTitle, request.getTitle());
        }
        if (request.getCategoryId() != null) {
            questionWrapper.eq(Question::getCategoryId, request.getCategoryId());
        }
        if (request.getType() != null) {
            questionWrapper.eq(Question::getType, request.getType());
        }
        if (request.getDifficulty() != null) {
            questionWrapper.eq(Question::getDifficulty, request.getDifficulty());
        }
        
        // 按收藏时间排序
        questionWrapper.orderByDesc(Question::getCreatedAt);
        
        Page<Question> questionPage = questionService.page(page, questionWrapper);
        
        // 转换为VO
        Page<QuestionVO> voPage = new Page<>();
        BeanUtils.copyProperties(questionPage, voPage, "records");
        voPage.setRecords(questionPage.getRecords().stream()
                .map(questionService::convertToVO)
                .collect(Collectors.toList()));
        
        return voPage;
    }
} 