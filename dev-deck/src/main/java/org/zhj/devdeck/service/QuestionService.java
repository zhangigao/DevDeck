package org.zhj.devdeck.service;

import org.zhj.devdeck.model.Question;
import org.zhj.devdeck.request.QuestionPageRequest;
import org.zhj.devdeck.vo.QuestionVO;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

/**
* @author 86155
* @description 针对表【question】的数据库操作Service
* @createDate 2025-05-23 20:52:16
*/
public interface QuestionService extends IService<Question> {

    /**
     * 分页查询题目
     */
    Page<QuestionVO> getQuestionPage(QuestionPageRequest request);

    /**
     * 根据分类ID获取题目列表
     */
    Page<QuestionVO> getQuestionsByCategory(Integer categoryId, Integer page, Integer size);

    /**
     * 根据slug获取题目
     */
    Question getQuestionBySlug(String slug);

    /**
     * 检查slug是否唯一
     */
    boolean isSlugUnique(String slug, Integer excludeId);

    /**
     * 转换为VO对象
     */
    QuestionVO convertToVO(Question question);

    /**
     * 获取我的题目列表
     */
    Page<QuestionVO> getMyQuestions(Integer userId, QuestionPageRequest request);

    /**
     * 获取一个随机题目
     */
    QuestionVO getRandomQuestion();
    
    /**
     * 获取多个随机题目
     */
    List<QuestionVO> getRandomQuestions(Integer count);

}
