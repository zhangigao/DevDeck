package org.zhj.devdeck.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.zhj.devdeck.model.Category;
import org.zhj.devdeck.vo.CategoryVO;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Test
    public void testGetCategoryTree() {
        List<CategoryVO> categoryTree = categoryService.getCategoryTree();
        assertNotNull(categoryTree);
        System.out.println("分类树结构: " + categoryTree);
    }

    @Test
    public void testGetEnabledCategories() {
        List<CategoryVO> enabledCategories = categoryService.getEnabledCategories();
        assertNotNull(enabledCategories);
        System.out.println("启用的分类: " + enabledCategories);
    }

    @Test
    public void testCreateCategory() {
        Category category = new Category();
        category.setName("测试分类");
        category.setSlug("test-category");
        category.setParentId(0);
        category.setSortWeight(999);
        category.setDescription("这是一个测试分类");
        category.setIcon("🧪");
        category.setIsEnabled("Y");

        boolean result = categoryService.save(category);
        assertTrue(result);
        assertNotNull(category.getId());
        System.out.println("创建的分类ID: " + category.getId());
    }

    @Test
    public void testIsSlugUnique() {
        boolean isUnique = categoryService.isSlugUnique("unique-test-slug", null);
        assertTrue(isUnique);

        boolean isNotUnique = categoryService.isSlugUnique("frontend", null);
        assertFalse(isNotUnique);
    }
} 