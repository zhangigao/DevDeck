package org.zhj.devdeck.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.validation.FieldError;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.enums.ResultCode;
import org.zhj.devdeck.exception.AuthException;
import org.zhj.devdeck.exception.QuizException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<String> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder errorMessage = new StringBuilder();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError) {
                String fieldName = ((FieldError) error).getField();
                String message = error.getDefaultMessage();
                errorMessage.append(fieldName).append(": ").append(message).append("; ");
            } else {
                String objectName = error.getObjectName();
                String message = error.getDefaultMessage();
                errorMessage.append(objectName).append(": ").append(message).append("; ");
            }
        });
        log.warn("参数验证失败: {}", errorMessage);
        return Result.error(ResultCode.INVALID_PARAMETER.getCode(), errorMessage.toString());
    }

    @ExceptionHandler(QuizException.class)
    public Result<String> handleQuizException(QuizException ex) {
        log.error("业务异常发生: {}", ex.getMessage(), ex);
        return Result.error(ex.getCode(), ex.getMessage());
    }
    @ExceptionHandler(AuthException.class)
    public Result<String> handleAuthException(AuthException ex) {
        log.error("认证异常发生: {}", ex.getMessage(), ex);
        return Result.error(ex.getErrorCode().getCode(), ex.getMessage());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result<String> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        log.error("请求参数缺失: {}", ex.getMessage(), ex);
        return Result.error(ResultCode.MISSING_PARAMETER.getCode(), ResultCode.MISSING_PARAMETER.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception ex) {
        // 记录详细的错误日志
        log.error("系统内部异常: {}", ex.getMessage(), ex);
        // 生产环境建议返回通用错误信息，避免暴露细节
        return Result.error(
                ResultCode.INTERNAL_SERVER_ERROR.getCode(),
                "服务器内部错误，请联系管理员"
        );
    }
}