package org.zhj.devdeck.callback;

import com.qiniu.util.Auth;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zhj.devdeck.common.QiniuAuditResult;
import org.zhj.devdeck.entity.AuditAvatar;
import org.zhj.devdeck.enums.AuditEnum;
import org.zhj.devdeck.service.AuditAvatarService;
import org.zhj.devdeck.service.UsersService;
import org.zhj.devdeck.service.impl.QiniuService;

import java.io.IOException;
import java.util.stream.Collectors;

/**
 * 七牛回调
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Slf4j
@RestController
@RequestMapping("/qiniu/callback")
@AllArgsConstructor
public class QiNiuCallBack {

    private final QiniuService qiNiuService;
    private final AuditAvatarService auditAvatarService;
    private final UsersService usersService;


    @PostMapping("/audit")
    public void handleAuditCallback(@RequestBody QiniuAuditResult result, HttpServletRequest request) throws IOException {
        log.info("Received audit callback: {}", result);
        // 1. 验证签名（防止伪造请求）
        String signHeader = request.getHeader("Authorization");
        boolean isValid = qiNiuService.verifySignature(
                request.getRequestURL().toString(),
                request.getMethod(),
                request.getInputStream(),
                signHeader
        );
        if (!isValid) throw new SecurityException("Invalid signature");
        // 2. 解析审核结果
        String finalSuggestion = result.getItems().getFirst().getResult().getResult().getSuggestion();
        boolean isApproved = "pass".equalsIgnoreCase(finalSuggestion);
        String fileKey = result.getInputBucket() + "/" + result.getInputKey();
        String avatarUrl = String.format("%s/%s", qiNiuService.getDOMAIN(), fileKey);
        // 3. 更新数据库状态
        String status = isApproved ? "active" : "blocked";
        auditAvatarService.updateStatus(avatarUrl, status);
        if (isApproved) {
            // 更新用户表中的头像
            //usersService.updateAvatar(avatarUrl);
        }
        // 4. 向用户发送审核失败消息
        if (status.equals(AuditEnum.AuditStatus.REJECT.getStatus())) {
            // TODO 到时候在加消息业务
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> handleCallback(
            @RequestParam("key") String key,
            @RequestParam("bucket") String bucket,
            @RequestParam("hash") String hash,
            @RequestParam("uid") String userId,
            HttpServletRequest request) {
        String fileKey = bucket + "/" + key;
        String avatarUrl = String.format("%s/%s", qiNiuService.getDOMAIN(), fileKey);
        // 验证回调合法性（关键步骤！）
        if (verifyCallback(request)) {
            return ResponseEntity.status(403).build();
        }
        // 构建文件访问URL
        String fileUrl = String.format("%s/%s", qiNiuService.getDOMAIN(), fileKey); // DOMAIN为配置的CDN域名
        // 更新用户头像
        AuditAvatar auditAvatar = new AuditAvatar();
        auditAvatar.setAvatarUrl(fileUrl);
        auditAvatar.setAuditType(AuditEnum.AuditType.AVATAR.getType());
        auditAvatar.setStatus(AuditEnum.AuditStatus.REVIEW.getStatus());
        auditAvatar.setOriginalHash(hash);
        auditAvatar.setSubmitUser(Long.parseLong(userId));
        auditAvatar.setAuditor(0L);
        auditAvatarService.save(auditAvatar);
        return ResponseEntity.ok().build();
    }

    public boolean verifyCallback(HttpServletRequest request) {
        Auth auth = Auth.create(qiNiuService.getACCESS_KEY(), qiNiuService.getSECRET_KEY());
        String originAuth = request.getHeader("Authorization");
        String callbackUrl = request.getRequestURL().toString();
        String body = getRequestBody(request); // 获取原始POST body
        String expectAuth = "QBox " + auth.signRequest(callbackUrl, body.getBytes(), null);
        return originAuth.equals(expectAuth);
    }

    private String getRequestBody(HttpServletRequest request) {
        try {
            return request.getReader().lines().collect(Collectors.joining());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
