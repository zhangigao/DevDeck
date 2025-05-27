package org.zhj.devdeck.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.zhj.devdeck.model.Category;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
* @author 86155
* @description 针对表【category】的数据库操作Mapper
* @createDate 2025-05-23 20:52:16
* @Entity org.zhj.devdeck.entity.Category
*/
@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

}




