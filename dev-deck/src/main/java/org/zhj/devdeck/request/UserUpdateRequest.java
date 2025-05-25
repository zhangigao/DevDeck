package org.zhj.devdeck.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户更新请求
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class UserUpdateRequest {

    public interface Password {}
    public interface Avatar {}
    public interface Nickname {}

    @NotBlank(message = "旧密码不能为空",groups = Password.class)
    private String oldPassword;
    @NotBlank(message = "新密码不能为空", groups = Password.class)
    private String newPassword;
    @NotBlank(message = "头像不能为空", groups = Avatar.class)
    private String avatarUrl;
    @NotBlank(message = "昵称不能为空", groups = Nickname.class)
    private String nickname;

}
