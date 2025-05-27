package org.zhj.devdeck.utils;

import org.zhj.devdeck.model.User;

import java.util.Optional;

/**
 * 用户请求上下文（线程安全）
 *
 * @Author 86155
 * @Date 2025/5/24
 */
public final class UserContext {

    // 静态 final 保证全局唯一且不可修改
    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();


    private UserContext() {}


    public static void set(User user) {
        CURRENT_USER.set(user);
    }


    public static Optional<User> get() {
        return Optional.ofNullable(CURRENT_USER.get());
    }

    /**
     * 强制获取当前用户（安全版）
     * @throws IllegalStateException 用户未登录时抛出
     */
    public static User require() {
        return get().orElseThrow(() ->
                new IllegalStateException("No user bound to current thread"));
    }

    public static void clear() {
        CURRENT_USER.remove();
    }
}