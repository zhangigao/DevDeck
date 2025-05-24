package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.zhj.devdeck.entity.Question;
import org.zhj.devdeck.service.QuestionService;
import org.zhj.devdeck.mapper.QuestionMapper;
import org.springframework.stereotype.Service;

/**
* @author 86155
* @description 针对表【question】的数据库操作Service实现
* @createDate 2025-05-23 20:52:16
*/
@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question>
    implements QuestionService{

}




