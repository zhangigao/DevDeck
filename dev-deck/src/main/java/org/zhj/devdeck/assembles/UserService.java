package org.zhj.devdeck.assembles;

import org.zhj.devdeck.dto.RegisterDTO;
import org.zhj.devdeck.response.CaptchaResponse;

/**
 * @Author 86155
 * @Date 2025/5/18
 */
public interface UserService {

    boolean existsByEmail(String email);

    void sendVerificationCode(String email, String captchaUuid, String captchaCode, Integer type, String ip);

    CaptchaResponse generateCaptcha(String uuid);

    String register(RegisterDTO request);

    String loginByPassword(String email, String password);

    String loginByCode(String email, String code);
}
