package org.zhj.devdeck.assembles;

import org.zhj.devdeck.dto.RegisterDTO;
import org.zhj.devdeck.model.User;
import org.zhj.devdeck.response.CaptchaResponse;
import org.zhj.devdeck.response.LoginResponse;

/**
 * @Author 86155
 * @Date 2025/5/18
 */
public interface UserService {

    boolean existsByEmail(String email);

    void sendVerificationCode(String email, String captchaUuid, String captchaCode, Integer type, String ip);

    CaptchaResponse generateCaptcha(String uuid);

    String register(RegisterDTO request);

    LoginResponse loginByPassword(String email, String password);

    LoginResponse loginByCode(String email, String code);

    void logout(Integer uid);

    void updatePassword(String oldPassword, String newPassword);

    String uploadToken(String uuid);
    
    void updateAvatar(User user);

    void updateNickname(User user);
}
