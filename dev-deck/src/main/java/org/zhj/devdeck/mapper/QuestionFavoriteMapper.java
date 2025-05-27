package org.zhj.devdeck.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.zhj.devdeck.model.QuestionFavorite;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @author 86155
 * @description 针对表【question_favorite】的数据库操作Mapper
 */
@Mapper
public interface QuestionFavoriteMapper extends BaseMapper<QuestionFavorite> {

} 