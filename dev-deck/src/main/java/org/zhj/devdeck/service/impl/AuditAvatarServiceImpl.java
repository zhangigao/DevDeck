package org.zhj.devdeck.service.impl;

import com.baomidou.mybatisplus.extension.conditions.update.LambdaUpdateChainWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.zhj.devdeck.entity.AuditAvatar;
import org.zhj.devdeck.enums.AuditEnum;
import org.zhj.devdeck.service.AuditAvatarService;
import org.zhj.devdeck.mapper.AuditAvatarMapper;
import org.springframework.stereotype.Service;

/**
* @author 86155
* @description 针对表【audit_avatar】的数据库操作Service实现
* @createDate 2025-05-25 15:21:31
*/
@Service
public class AuditAvatarServiceImpl extends ServiceImpl<AuditAvatarMapper, AuditAvatar>
    implements AuditAvatarService{

    @Override
    public void updateStatus(String fileUrl, String status) {
        new LambdaUpdateChainWrapper<AuditAvatar>(this.baseMapper)
                .eq(AuditAvatar::getAvatarUrl, fileUrl)
                .set(AuditAvatar::getStatus, status)
                .update();
    }
}




