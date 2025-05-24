package org.zhj.devdeck.exception;

import lombok.Getter;

/**
 * @Author 86155
 * @Date 2025/5/18
 */

@Getter
public class QuizException extends RuntimeException {

    private Integer code;

    public QuizException() {
        super();
    }

    public QuizException(String message) {
        super(message);
    }

    public QuizException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public QuizException(String message, Throwable cause) {
        super(message, cause);
    }
}
