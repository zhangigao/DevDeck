package org.zhj.devdeck.service;

import org.zhj.devdeck.model.AuditAvatar;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author 86155
* @description 针对表【audit_avatar】的数据库操作Service
* @createDate 2025-05-25 15:21:31
*/
public interface AuditAvatarService extends IService<AuditAvatar> {

    void updateStatus(String fileUrl, String status);
}
