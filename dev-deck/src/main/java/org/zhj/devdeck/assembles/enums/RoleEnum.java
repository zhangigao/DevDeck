package org.zhj.devdeck.assembles.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 角色枚举表
 */
@Getter
@AllArgsConstructor
public enum RoleEnum {
    SYSTEM_ADMIN(1,  "系统管理员"),
    BIZ_CONTENT_REVIEW(2,"内容审核员"),
    MEMBER_GOLD(3,  "会员-金卡会员"),
    REGULAR_USER(4,"普通用户")

    ;

    public final Integer code;
    public final String name;
}
