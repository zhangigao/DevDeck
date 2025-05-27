package org.zhj.devdeck.service;

import org.zhj.devdeck.model.Category;
import org.zhj.devdeck.vo.CategoryVO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author 86155
* @description 针对表【category】的数据库操作Service
* @createDate 2025-05-23 20:52:16
*/
public interface CategoryService extends IService<Category> {

    /**
     * 获取分类树形结构
     */
    List<CategoryVO> getCategoryTree();

    /**
     * 获取启用的分类列表
     */
    List<CategoryVO> getEnabledCategories();

    /**
     * 根据slug获取分类
     */
    Category getCategoryBySlug(String slug);

    /**
     * 检查slug是否唯一
     */
    boolean isSlugUnique(String slug, Integer excludeId);

}
