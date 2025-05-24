package org.zhj.devdeck.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 状态码
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "成功"),
    FAIL(400, "失败"),
    UNAUTHORIZED(401, "未认证"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "未找到"),
    INTERNAL_SERVER_ERROR(999, "服务器开小差"),
    INVALID_PARAMETER(400, "参数有误"),
    MISSING_PARAMETER(400, "缺少必要参数"),
    USERNAME_OR_PASSWORD_ERROR(401, "用户名或密码错误"),



    ;

    private final Integer code;
    private final String message;

}
