package org.zhj.devdeck.service.impl;

import com.qiniu.util.Auth;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.zhj.devdeck.exception.QuizException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.stream.Collectors;

import static org.apache.tomcat.util.codec.binary.Base64.*;

/**
 * 七牛云OSS工具类
 *
 * @Author 86155
 * @Date 2025/5/25
 */
@Slf4j
@Data
@Service
public class QiniuService {

    @Value("${qiniu.upload.bucket}")
    private String BUCKET_NAME;
    @Value("${qiniu.upload.access-key}")
    private String ACCESS_KEY;
    @Value("${qiniu.upload.secret-key}")
    private String SECRET_KEY;
    @Value("${qiniu.domain}")
    private String DOMAIN;

    /**
     * 获取上传token
     *
     * @param key
     * @return
     */
    public String uploadToken(String key) {
        Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
        String token = auth.uploadToken(BUCKET_NAME, key);
        log.info("上传凭证：{}",token);
        return token;
    }


    public boolean verifySignature(String url, String method, InputStream bodyStream, String authHeader) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA1");
            hmac.init(new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA1"));
            // 构建待签名字符串
            String data = method + " " + url + "\n";
            if (bodyStream != null) {
                data += new BufferedReader(new InputStreamReader(bodyStream))
                        .lines().collect(Collectors.joining("\n"));
            }
            // 计算签名
            byte[] signature = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String expect = "Qiniu " + encodeBase64String(signature);
            return authHeader.equals(expect);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new QuizException("签名验证失败");
        }
    }
}
