package org.zhj.devdeck.dto;

import lombok.Data;

/**
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class UserPageDTO {

    private Integer pageNo;
    private Integer pageSize;
    private String nickName;
    private String email;

}
