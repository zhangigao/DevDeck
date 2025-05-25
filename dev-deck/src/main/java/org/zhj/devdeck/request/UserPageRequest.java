package org.zhj.devdeck.request;

import lombok.Data;

/**
 * 用户分页请求
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class UserPageRequest {

    private Integer pageNo = 1;
    private Integer pageSize = 10;
    private String nickName;
    private String email;
}
