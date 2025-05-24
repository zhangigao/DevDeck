package org.zhj.devdeck.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum AuthErrorCode {
    MISSING_TOKEN(401, "请求Token为空"),
    INVALID_TOKEN(401, "Token验证失败"),
    TOKEN_MISMATCH(401, "Token与服务器记录不一致"),
    TOKEN_PARSE_ERROR(902, "Token解析异常"),
    AUTH_SYSTEM_ERROR(999, "认证系统异常");
    
    private final int code;
    private final String desc;
}