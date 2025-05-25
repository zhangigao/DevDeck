package org.zhj.devdeck.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 七牛云审核状态
 */
public interface AuditEnum {

    @Getter
    @AllArgsConstructor
    enum AuditStatus {
        PASS("pass"),
        REJECT("reject"),
        REVIEW("review");

        private final String status;
    }


    @Getter
    @AllArgsConstructor
    enum AuditType {

        AVATAR("avatar"),
        QUESTION("question")


        ;
        private final String type;
    }
}
