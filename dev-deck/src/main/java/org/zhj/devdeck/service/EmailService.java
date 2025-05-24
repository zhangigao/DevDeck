package org.zhj.devdeck.service;

/**
 * 邮箱发送服务接口
 */
public interface EmailService {

    void sendVerificationCode(String to, String code);
}
