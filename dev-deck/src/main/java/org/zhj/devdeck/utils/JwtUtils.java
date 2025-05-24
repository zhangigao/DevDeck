package org.zhj.devdeck.utils;

import com.alibaba.fastjson.JSONObject;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.zhj.devdeck.entity.User;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT工具类
 *
 * @Author 86155
 * @Date 2025/5/19
 */
public class JwtUtils {

    private static final String jwtSecret = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // token过期时间 - 30分钟
    private static final long EXPIRATION_TIME = 30 * 60 * 1000;

    private static SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /** 生成JWT Token */
    public static String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(JSONObject.toJSONString(user))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /** 从token中获取用户 */
    public static String getUserFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /** 验证token是否有效 */
    public static boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
