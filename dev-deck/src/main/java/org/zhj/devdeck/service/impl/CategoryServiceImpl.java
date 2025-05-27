package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.zhj.devdeck.model.Category;
import org.zhj.devdeck.service.CategoryService;
import org.zhj.devdeck.mapper.CategoryMapper;
import org.zhj.devdeck.vo.CategoryVO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
* @author 86155
* @description 针对表【category】的数据库操作Service实现
* @createDate 2025-05-23 20:52:16
*/
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category>
    implements CategoryService{

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> allCategories = list(new LambdaQueryWrapper<Category>()
                .orderByAsc(Category::getSortWeight));
        
        return buildCategoryTree(allCategories, null);
    }

    @Override
    public List<CategoryVO> getEnabledCategories() {
        List<Category> enabledCategories = list(new LambdaQueryWrapper<Category>()
                .eq(Category::getIsEnabled, "Y")
                .orderByAsc(Category::getSortWeight));
        
        return buildCategoryTree(enabledCategories, null);
    }

    @Override
    public Category getCategoryBySlug(String slug) {
        return getOne(new LambdaQueryWrapper<Category>()
                .eq(Category::getSlug, slug));
    }

    @Override
    public boolean isSlugUnique(String slug, Integer excludeId) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<Category>()
                .eq(Category::getSlug, slug);
        
        if (excludeId != null) {
            wrapper.ne(Category::getId, excludeId);
        }
        
        return count(wrapper) == 0;
    }

    private List<CategoryVO> buildCategoryTree(List<Category> categories, Integer parentId) {
        List<CategoryVO> result = new ArrayList<>();
        
        Map<Integer, List<Category>> categoryMap = categories.stream()
                .collect(Collectors.groupingBy(category -> 
                    category.getParentId() == null ? 0 : category.getParentId()));
        
        List<Category> rootCategories = categoryMap.get(parentId == null ? 0 : parentId);
        if (rootCategories == null) {
            return result;
        }
        
        for (Category category : rootCategories) {
            CategoryVO vo = new CategoryVO();
            BeanUtils.copyProperties(category, vo);
            
            // 递归构建子分类
            List<CategoryVO> children = buildCategoryTree(categories, category.getId());
            vo.setChildren(children);
            
            result.add(vo);
        }
        
        return result;
    }
}




