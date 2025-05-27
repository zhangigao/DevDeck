package org.zhj.devdeck.enums;

import lombok.Getter;

/**
 * 题目类型枚举
 */
@Getter
public enum QuestionType {
    SINGLE_CHOICE(1, "单选题"),
    MULTIPLE_CHOICE(2, "多选题"),
    FILL_BLANK(3, "填空题"),
    PROGRAMMING(4, "编程题"),
    DESIGN(5, "设计题"),
    ESSAY(6, "问答题");

    private final Integer code;
    private final String name;

    QuestionType(Integer code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String getNameByCode(Integer code) {
        for (QuestionType type : values()) {
            if (type.getCode().equals(code)) {
                return type.getName();
            }
        }
        return "未知类型";
    }
} 