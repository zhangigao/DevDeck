package org.zhj.devdeck.constant;

/**
 * Redis常量
 *
 * @Author 86155
 * @Date 2025/5/24
 */
public class RedisConstant {

    public static final String TOKEN_PREFIX = "user:token:";
    public static final Integer TOKEN_EXPIRE = 60 * 60 * 24 * 7;
    public static final String CAPTCHA_PREFIX = "captcha:";
    public static final Integer CAPTCHA_EXPIRE = 60 * 5;
    public static final String VERIFY_PREFIX = "verify:";
    public static final String BUSINESS_TYPE_REGISTER = "register:";
    public static final String BUSINESS_TYPE_LOGIN = "login:";
    public static final String BUSINESS_TYPE_RESET_PASSWORD = "reset_password:";
    public static final String IP_LIMIT = "ip:limit:";
    public static final String USER_LIMIT = "user:limit:";

}
