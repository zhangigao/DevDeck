package org.zhj.devdeck.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.zhj.devdeck.exception.QuizException;
import org.zhj.devdeck.service.EmailService;

import java.util.Properties;

/**
 * 验证发送服务
 * @Author 86155
 * @Date 2025/5/18
 */
@Slf4j
@Service
public class Email163Domain implements EmailService {

    @Value("${mail.host}")
    private String host;
    @Value("${mail.username}")
    private String username;
    @Value("${mail.password}")
    private String password;
    @Value("${mail.verification.subject}")
    private String subject;
    @Value("${mail.verification.template}")
    private String template;

    public void sendVerificationCode(String to, String code) {
        log.info("发送验证码: {}", code);
        Properties properties = new Properties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.auth", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Message message = new MimeMessage(session);
        try {
            message.setFrom(new InternetAddress(username));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);
            message.setText(String.format(template, code));
            log.info("发送邮件: {}", JSONObject.toJSONString(message));
            Transport.send(message);
        } catch (MessagingException e) {
            throw new QuizException("发送邮件失败: " + e.getMessage(), e);
        }
    }

}
