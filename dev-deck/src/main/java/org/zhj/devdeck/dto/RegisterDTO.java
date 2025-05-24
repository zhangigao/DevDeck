package org.zhj.devdeck.dto;

import lombok.Data;

/**
 * @Author 86155
 * @Date 2025/5/19
 */
@Data
public class RegisterDTO {

    private String email;
    private String password;
    private String code;
    private String nickname;
}
