package org.zhj.devdeck.enums;

import lombok.Getter;

/**
 * 题目难度枚举
 */
@Getter
public enum QuestionDifficulty {
    EASY(1, "简单"),
    MEDIUM(2, "中等"),
    HARD(3, "困难"),
    HELL(4, "地狱");

    private final Integer code;
    private final String name;

    QuestionDifficulty(Integer code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String getNameByCode(Integer code) {
        for (QuestionDifficulty difficulty : values()) {
            if (difficulty.getCode().equals(code)) {
                return difficulty.getName();
            }
        }
        return "未知难度";
    }
} 