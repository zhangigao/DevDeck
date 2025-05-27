package org.zhj.devdeck.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.model.Question;
import org.zhj.devdeck.request.CreateQuestionRequest;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.request.UpdateQuestionRequest;
import org.zhj.devdeck.service.QuestionService;
import org.zhj.devdeck.utils.UserContext;
import org.zhj.devdeck.vo.QuestionVO;

import java.util.List;

/**
 * 题目控制器
 */
@RestController
@RequestMapping("/api/questions")
@CrossOrigin
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * 分页查询题目
     */
    @GetMapping
    public Result<Page<QuestionVO>> getQuestionPage(QuestionPageRequest request) {
        Page<QuestionVO> page = questionService.getQuestionPage(request);
        return Result.success(page);
    }

    /**
     * 根据分类ID获取题目列表
     */
    @GetMapping("/category/{categoryId}")
    public Result<Page<QuestionVO>> getQuestionsByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<QuestionVO> questionPage = questionService.getQuestionsByCategory(categoryId, page, size);
        return Result.success(questionPage);
    }

    /**
     * 根据ID获取题目详情
     */
    @GetMapping("/{id}")
    public Result<QuestionVO> getQuestionById(@PathVariable Integer id) {
        Question question = questionService.getById(id);
        if (question == null) {
            return Result.error("题目不存在");
        }
        QuestionVO vo = questionService.convertToVO(question);
        return Result.success(vo);
    }

    /**
     * 根据slug获取题目
     */
    @GetMapping("/slug/{slug}")
    public Result<QuestionVO> getQuestionBySlug(@PathVariable String slug) {
        Question question = questionService.getQuestionBySlug(slug);
        if (question == null) {
            return Result.error("题目不存在");
        }
        QuestionVO vo = questionService.convertToVO(question);
        return Result.success(vo);
    }

    /**
     * 创建题目
     */
    @PostMapping
    public Result<QuestionVO> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        // 检查slug是否唯一
        if (!questionService.isSlugUnique(request.getSlug(), null)) {
            return Result.error("题目标识已存在");
        }

        Question question = new Question();
        BeanUtils.copyProperties(request, question);
        
        boolean success = questionService.save(question);
        if (success) {
            QuestionVO vo = questionService.convertToVO(question);
            return Result.success(vo);
        } else {
            return Result.error("创建题目失败");
        }
    }

    /**
     * 更新题目
     */
    @PutMapping("/{id}")
    public Result<QuestionVO> updateQuestion(@PathVariable Integer id, 
                                           @Valid @RequestBody UpdateQuestionRequest request) {
        Question existingQuestion = questionService.getById(id);
        if (existingQuestion == null) {
            return Result.error("题目不存在");
        }

        // 检查slug是否唯一
        if (!questionService.isSlugUnique(request.getSlug(), id)) {
            return Result.error("题目标识已存在");
        }

        BeanUtils.copyProperties(request, existingQuestion);
        existingQuestion.setId(id);
        
        boolean success = questionService.updateById(existingQuestion);
        if (success) {
            QuestionVO vo = questionService.convertToVO(existingQuestion);
            return Result.success(vo);
        } else {
            return Result.error("更新题目失败");
        }
    }

    /**
     * 删除题目
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteQuestion(@PathVariable Integer id) {
        Question question = questionService.getById(id);
        if (question == null) {
            return Result.error("题目不存在");
        }

        boolean success = questionService.removeById(id);
        if (success) {
            return Result.success();
        } else {
            return Result.error("删除题目失败");
        }
    }

    /**
     * 检查slug是否唯一
     */
    @GetMapping("/check-slug")
    public Result<Boolean> checkSlugUnique(@RequestParam String slug, 
                                         @RequestParam(required = false) Integer excludeId) {
        boolean isUnique = questionService.isSlugUnique(slug, excludeId);
        return Result.success(isUnique);
    }

    /**
     * 增加题目提交次数
     */
    @PostMapping("/{id}/submit")
    public Result<Void> incrementSubmitCount(@PathVariable Integer id) {
        Question question = questionService.getById(id);
        if (question == null) {
            return Result.error("题目不存在");
        }

        question.setSubmitCount(question.getSubmitCount() == null ? 1 : question.getSubmitCount() + 1);
        boolean success = questionService.updateById(question);
        
        if (success) {
            return Result.success();
        } else {
            return Result.error("更新提交次数失败");
        }
    }

    /**
     * 获取我的题目列表
     */
    @GetMapping("/my")
    public Result<Page<QuestionVO>> getMyQuestions(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer difficulty) {

        Integer id = UserContext.require().getId();
        QuestionPageRequest request = new QuestionPageRequest();
        request.setPage(page);
        request.setSize(size);
        request.setTitle(title);
        request.setCategoryId(categoryId);
        request.setType(type);
        request.setDifficulty(difficulty);
        
        Page<QuestionVO> questionPage = questionService.getMyQuestions(id, request);
        return Result.success(questionPage);
    }
    
    /**
     * 随机获取一道题目
     */
    @GetMapping("/random")
    public Result<QuestionVO> getRandomQuestion() {
        QuestionVO question = questionService.getRandomQuestion();
        if (question == null) {
            return Result.error("未找到可用题目");
        }
        return Result.success(question);
    }

    /**
     * 随机获取多道题目
     */
    @GetMapping("/random-batch")
    public Result<List<QuestionVO>> getRandomQuestions(
            @RequestParam(defaultValue = "5") Integer count) {
        if (count <= 0 || count > 50) {
            return Result.error("请求数量应在1-50之间");
        }
        
        List<QuestionVO> questions = questionService.getRandomQuestions(count);
        return Result.success(questions);
    }
} 