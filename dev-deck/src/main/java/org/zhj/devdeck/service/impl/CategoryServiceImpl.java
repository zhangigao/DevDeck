package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.zhj.devdeck.entity.Category;
import org.zhj.devdeck.service.CategoryService;
import org.zhj.devdeck.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

/**
* @author 86155
* @description 针对表【category】的数据库操作Service实现
* @createDate 2025-05-23 20:52:16
*/
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category>
    implements CategoryService{

}




