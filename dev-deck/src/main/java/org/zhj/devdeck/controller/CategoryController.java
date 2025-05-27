package org.zhj.devdeck.controller;

import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.model.Category;
import org.zhj.devdeck.request.CreateCategoryRequest;
import org.zhj.devdeck.request.UpdateCategoryRequest;
import org.zhj.devdeck.service.CategoryService;
import org.zhj.devdeck.vo.CategoryVO;


import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 获取分类树形结构
     */
    @GetMapping("/tree")
    public Result<List<CategoryVO>> getCategoryTree() {
        List<CategoryVO> categoryTree = categoryService.getCategoryTree();
        return Result.success(categoryTree);
    }

    /**
     * 获取启用的分类列表
     */
    @GetMapping("/enabled")
    public Result<List<CategoryVO>> getEnabledCategories() {
        List<CategoryVO> categories = categoryService.getEnabledCategories();
        return Result.success(categories);
    }

    /**
     * 根据ID获取分类详情
     */
    @GetMapping("/{id}")
    public Result<Category> getCategoryById(@PathVariable Integer id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }
        return Result.success(category);
    }

    /**
     * 根据slug获取分类
     */
    @GetMapping("/slug/{slug}")
    public Result<Category> getCategoryBySlug(@PathVariable String slug) {
        Category category = categoryService.getCategoryBySlug(slug);
        if (category == null) {
            return Result.error("分类不存在");
        }
        return Result.success(category);
    }

    /**
     * 创建分类
     */
    @PostMapping
    public Result<Category> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        // 检查slug是否唯一
        if (!categoryService.isSlugUnique(request.getSlug(), null)) {
            return Result.error("分类标识已存在");
        }

        Category category = new Category();
        BeanUtils.copyProperties(request, category);
        
        boolean success = categoryService.save(category);
        if (success) {
            return Result.success(category);
        } else {
            return Result.error("创建分类失败");
        }
    }

    /**
     * 更新分类
     */
    @PutMapping("/{id}")
    public Result<Category> updateCategory(@PathVariable Integer id, 
                                         @Valid @RequestBody UpdateCategoryRequest request) {
        Category existingCategory = categoryService.getById(id);
        if (existingCategory == null) {
            return Result.error("分类不存在");
        }

        // 检查slug是否唯一
        if (!categoryService.isSlugUnique(request.getSlug(), id)) {
            return Result.error("分类标识已存在");
        }

        BeanUtils.copyProperties(request, existingCategory);
        existingCategory.setId(id);
        
        boolean success = categoryService.updateById(existingCategory);
        if (success) {
            return Result.success(existingCategory);
        } else {
            return Result.error("更新分类失败");
        }
    }

    /**
     * 删除分类
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Integer id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }

        boolean success = categoryService.removeById(id);
        if (success) {
            return Result.success();
        } else {
            return Result.error("删除分类失败");
        }
    }

    /**
     * 检查slug是否唯一
     */
    @GetMapping("/check-slug")
    public Result<Boolean> checkSlugUnique(@RequestParam String slug, 
                                         @RequestParam(required = false) Integer excludeId) {
        boolean isUnique = categoryService.isSlugUnique(slug, excludeId);
        return Result.success(isUnique);
    }
} 