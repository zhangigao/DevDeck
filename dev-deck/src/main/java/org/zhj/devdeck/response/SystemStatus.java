package org.zhj.devdeck.response;

import lombok.Data;

/**
 * 系统状态
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Data
public class SystemStatus {

    private float cpu;
    private float memory;
    private float disk;
    private float network;

}
