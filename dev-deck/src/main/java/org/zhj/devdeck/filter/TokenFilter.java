package org.zhj.devdeck.filter;

import com.alibaba.fastjson.JSONObject;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zhj.devdeck.common.Result;
import org.zhj.devdeck.constant.RedisConstant;
import org.zhj.devdeck.entity.User;
import org.zhj.devdeck.enums.AuthErrorCode;
import org.zhj.devdeck.exception.AuthException;
import org.zhj.devdeck.utils.JwtUtils;
import org.zhj.devdeck.utils.UserContext;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

/**
 * token过滤器
 * @Author 86155
 * @Date 2025/5/24
 */
@Component
@RequiredArgsConstructor
public class TokenFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        try {
            // 排除登录与注册接口
            if (isLoginOrRegisterRequest(request)) {
                filterChain.doFilter(request, response);
                return;
            }
            // 校验 Token 基础有效性
            String token = extractToken(request);
            if (!JwtUtils.validateToken(token)) {
                throw new AuthException("Token验证失败", AuthErrorCode.INVALID_TOKEN);
            }
            // 解析用户信息
            User user = parseUserFromToken(token);
            // 校验 Redis 令牌一致性
            validateTokenInRedis(user.getId(), token);
            // 刷新 Token 有效期
            refreshTokenExpiration(user.getId());
            // 构建用户请求上下文
            buildAuthentication(user);
            filterChain.doFilter(request, response);
        } catch (AuthException ex) {
            AuthErrorCode errorCode = ex.getErrorCode();
            response.getWriter().write(JSONObject.toJSONString(Result.error(errorCode.getCode(), errorCode.getDesc())));
        } catch (Exception ex) {
            response.getWriter().write(JSONObject.toJSONString(Result.error(AuthErrorCode.AUTH_SYSTEM_ERROR.getCode(), ex.getMessage())));
        } finally {
            UserContext.clear();
        }
    }

    private void buildAuthentication(User user) {
        UserContext.set(user);
    }

//------------------------ 辅助方法封装 ------------------------

    private boolean isLoginOrRegisterRequest(HttpServletRequest request) {
        return "/dev-deck/user/login".equals(request.getRequestURI())
                || "/dev-deck/user/register".equals(request.getRequestURI())
                || "/dev-deck/user/verification-code".equals(request.getRequestURI())
                || "/dev-deck/user/captcha".equals(request.getRequestURI());
    }

    private String extractToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token)) {
            throw new AuthException(AuthErrorCode.MISSING_TOKEN.getDesc(), AuthErrorCode.MISSING_TOKEN);
        }
        return token;
    }

    private User parseUserFromToken(String token) {
        try {
            String userJson = JwtUtils.getUserFromToken(token);
            return JSONObject.parseObject(userJson, User.class);
        } catch (Exception ex) {
            throw new AuthException(AuthErrorCode.TOKEN_PARSE_ERROR.getDesc(), AuthErrorCode.TOKEN_PARSE_ERROR, ex);
        }
    }

    private void validateTokenInRedis(Integer userId, String token) {
        String redisKey = RedisConstant.TOKEN_PREFIX + userId;
        String redisToken = redisTemplate.opsForValue().get(redisKey);

        if (!token.equals(redisToken)) {
            throw new AuthException(AuthErrorCode.TOKEN_MISMATCH.getDesc(), AuthErrorCode.TOKEN_MISMATCH);
        }
    }

    private void refreshTokenExpiration(Integer userId) {
        String redisKey = RedisConstant.TOKEN_PREFIX + userId;
        redisTemplate.expire(redisKey, 30, TimeUnit.MINUTES);
    }

}
