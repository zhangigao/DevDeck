package org.zhj.devdeck.common;

import lombok.Data;
import org.zhj.devdeck.enums.ResultCode;
import org.zhj.devdeck.exception.QuizException;

/**
 * 统一返回结果类
 *
 * @Author 86155
 * @Date 2025/5/18
 */
@Data
public class Result <T>{

    private Integer code;
    private String message;
    private T data;


    public static <T> Result<T> success(){
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        return result;
    }

    public static <T> Result<T> success(T data){
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(T data, String message){
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> error(Integer code, String message){
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> error(ResultCode resultCode){
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(resultCode.getMessage());
        return result;
    }

    public static <T> Result<T> error(QuizException quizException){
        Result<T> result = new Result<>();
        result.setCode(quizException.getCode());
        result.setMessage(quizException.getMessage());
        return result;
    }
}
