package org.zhj.devdeck.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

/**
 * 
 * @TableName users
 */
@TableName(value ="users")
@Data
public class User {
    /**
     * 主键
     */
    @TableId(value = "id",type = IdType.AUTO)
    private Integer id;

    /**
     * 用户唯一标识
     */
    @TableField(value = "uuid",fill = FieldFill.INSERT)
    private String uuid;

    /**
     * 账户邮箱
     */
    private String email;

    /**
     * 账户密码
     */
    private String password;

    /**
     * 用户名称
     */
    private String nickname;

    /**
     * 注册日期
     */
    @TableField(value = "created_at",fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 最后一次登录日期
     */
    @TableField(value = "updated_at",fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    /**
     * 删除日期
     */
    @TableLogic(
            value = "null",
            delval = "NOW()"
    )
    private Date deletedAt;

    /**
     * 头像
     */
    private String avatarUrl;

    private String githubId;

    private String githubLogin;
}