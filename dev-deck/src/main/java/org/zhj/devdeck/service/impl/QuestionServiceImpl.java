package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.zhj.devdeck.enums.QuestionDifficulty;
import org.zhj.devdeck.enums.QuestionType;
import org.zhj.devdeck.model.Category;
import org.zhj.devdeck.model.Question;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.service.CategoryService;
import org.zhj.devdeck.service.QuestionService;
import org.zhj.devdeck.mapper.QuestionMapper;
import org.zhj.devdeck.vo.QuestionVO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
* @author 86155
* @description 针对表【question】的数据库操作Service实现
* @createDate 2025-05-23 20:52:16
*/
@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question>
    implements QuestionService{

    @Autowired
    private QuestionMapper questionMapper;
    
    @Autowired
    private CategoryService categoryService;

    @Override
    public Page<QuestionVO> getQuestionPage(QuestionPageRequest request) {
        Page<Question> page = new Page<>(request.getPage(), request.getSize());
        
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        
        // 条件查询
        if (StringUtils.hasText(request.getTitle())) {
            wrapper.like(Question::getTitle, request.getTitle());
        }
        if (request.getCategoryId() != null) {
            wrapper.eq(Question::getCategoryId, request.getCategoryId());
        }
        if (request.getType() != null) {
            wrapper.eq(Question::getType, request.getType());
        }
        if (request.getDifficulty() != null) {
            wrapper.eq(Question::getDifficulty, request.getDifficulty());
        }
        if (request.getIsOfficial() != null) {
            wrapper.eq(Question::getIsOfficial, request.getIsOfficial());
        }
        if (request.getIsEnabled() != null) {
            wrapper.eq(Question::getIsEnabled, request.getIsEnabled());
        }
        
        // 排序
        if ("title".equals(request.getSortBy())) {
            if ("asc".equals(request.getSortOrder())) {
                wrapper.orderByAsc(Question::getTitle);
            } else {
                wrapper.orderByDesc(Question::getTitle);
            }
        } else if ("difficulty".equals(request.getSortBy())) {
            if ("asc".equals(request.getSortOrder())) {
                wrapper.orderByAsc(Question::getDifficulty);
            } else {
                wrapper.orderByDesc(Question::getDifficulty);
            }
        } else {
            if ("asc".equals(request.getSortOrder())) {
                wrapper.orderByAsc(Question::getCreatedAt);
            } else {
                wrapper.orderByDesc(Question::getCreatedAt);
            }
        }
        
        Page<Question> questionPage = page(page, wrapper);
        
        // 转换为VO
        Page<QuestionVO> voPage = new Page<>();
        BeanUtils.copyProperties(questionPage, voPage, "records");
        voPage.setRecords(questionPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(java.util.stream.Collectors.toList()));
        
        return voPage;
    }

    @Override
    public Page<QuestionVO> getQuestionsByCategory(Integer categoryId, Integer page, Integer size) {
        Page<Question> questionPage = new Page<>(page, size);
        
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<Question>()
                .eq(Question::getCategoryId, categoryId)
                .eq(Question::getIsEnabled, true)
                .orderByDesc(Question::getCreatedAt);
        
        Page<Question> result = page(questionPage, wrapper);
        
        // 转换为VO
        Page<QuestionVO> voPage = new Page<>();
        BeanUtils.copyProperties(result, voPage, "records");
        voPage.setRecords(result.getRecords().stream()
                .map(this::convertToVO)
                .collect(java.util.stream.Collectors.toList()));
        
        return voPage;
    }

    @Override
    public Question getQuestionBySlug(String slug) {
        return getOne(new LambdaQueryWrapper<Question>()
                .eq(Question::getSlug, slug));
    }

    @Override
    public boolean isSlugUnique(String slug, Integer excludeId) {
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<Question>()
                .eq(Question::getSlug, slug);
        
        if (excludeId != null) {
            wrapper.ne(Question::getId, excludeId);
        }
        
        return count(wrapper) == 0;
    }

    @Override
    public QuestionVO convertToVO(Question question) {
        QuestionVO vo = new QuestionVO();
        BeanUtils.copyProperties(question, vo);
        
        // 设置类型名称
        vo.setTypeName(QuestionType.getNameByCode(question.getType()));
        
        // 设置难度名称
        vo.setDifficultyName(QuestionDifficulty.getNameByCode(question.getDifficulty()));
        
        // 设置分类名称
        if (question.getCategoryId() != null) {
            Category category = categoryService.getById(question.getCategoryId());
            if (category != null) {
                vo.setCategoryName(category.getName());
            }
        }
        
        return vo;
    }

    @Override
    public Page<QuestionVO> getMyQuestions(Integer userId, QuestionPageRequest request) {
        Page<Question> page = new Page<>(request.getPage(), request.getSize());
        
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<>();
        
        // 只查询当前用户创建的题目
        wrapper.eq(Question::getCreatedBy, userId);
        
        // 条件查询
        if (StringUtils.hasText(request.getTitle())) {
            wrapper.like(Question::getTitle, request.getTitle());
        }
        if (request.getCategoryId() != null) {
            wrapper.eq(Question::getCategoryId, request.getCategoryId());
        }
        if (request.getType() != null) {
            wrapper.eq(Question::getType, request.getType());
        }
        if (request.getDifficulty() != null) {
            wrapper.eq(Question::getDifficulty, request.getDifficulty());
        }
        
        // 排序
        wrapper.orderByDesc(Question::getCreatedAt);
        
        Page<Question> questionPage = page(page, wrapper);
        
        // 转换为VO
        Page<QuestionVO> voPage = new Page<>();
        BeanUtils.copyProperties(questionPage, voPage, "records");
        voPage.setRecords(questionPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(java.util.stream.Collectors.toList()));
        
        return voPage;
    }
    
    @Override
    public QuestionVO getRandomQuestion() {
        // 只获取启用状态的题目
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<Question>()
                .eq(Question::getIsEnabled, true);
        
        long total = count(wrapper);
        if (total == 0) {
            return null;
        }
        
        // 生成随机索引
        Random random = new Random();
        int randomIndex = random.nextInt((int) total);
        
        // 随机获取一条记录
        Page<Question> page = new Page<>(randomIndex + 1, 1);
        Page<Question> result = page(page, wrapper);
        
        if (result.getRecords().isEmpty()) {
            return null;
        }
        
        return convertToVO(result.getRecords().get(0));
    }
    
    @Override
    public List<QuestionVO> getRandomQuestions(Integer count) {
        if (count == null || count <= 0) {
            count = 5; // 默认获取5道题
        }
        
        // 只获取启用状态的题目
        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<Question>()
                .eq(Question::getIsEnabled, true);
        
        long total = count(wrapper);
        if (total == 0) {
            return new ArrayList<>();
        }
        
        // 如果请求数量大于总数，则返回所有题目
        if (count >= total) {
            List<Question> allQuestions = list(wrapper);
            return allQuestions.stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
        }
        
        // 获取所有题目ID
        List<Integer> allIds = list(wrapper).stream()
                .map(Question::getId)
                .collect(Collectors.toList());
        
        // 随机选择count个ID
        List<Integer> randomIds = new ArrayList<>();
        Random random = new Random();
        while (randomIds.size() < count) {
            int randomIndex = random.nextInt(allIds.size());
            Integer id = allIds.get(randomIndex);
            if (!randomIds.contains(id)) {
                randomIds.add(id);
            }
        }
        
        // 根据随机选择的ID获取题目
        List<Question> randomQuestions = listByIds(randomIds);
        
        return randomQuestions.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }
}




