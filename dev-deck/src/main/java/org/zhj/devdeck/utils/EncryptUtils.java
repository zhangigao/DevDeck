package org.zhj.devdeck.utils;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.symmetric.AES;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * 加/解密工具类
 *
 * @Author 86155
 * @Date 2025/5/19
 */
public class EncryptUtils {

    private static final String KEY = "Dev-Deck-Key1234"; // 16字节
    private static final AES aes = SecureUtil.aes(KEY.getBytes(StandardCharsets.UTF_8));

    /** 加密对象 */
    public static String encrypt(Object obj) {
        if(obj == null) {
            return null;
        }
        String json = JSON.toJSONString(obj);
        byte[] bytes = aes.encrypt(json);
        return Base64.getEncoder().encodeToString(bytes);
    }

    /** 解密对象 */
    public static <T> T decrypt(String str, Class<T> clazz) {
        if(StringUtils.isBlank(str)) {
            return null;
        }
        byte[] bytes = Base64.getDecoder().decode(str);
        byte[] decrypt = aes.decrypt(bytes);
        return JSON.parseObject(new String(decrypt, StandardCharsets.UTF_8), clazz);
    }
}
