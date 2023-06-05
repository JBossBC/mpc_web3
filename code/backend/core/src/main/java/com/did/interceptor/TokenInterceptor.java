package com.did.interceptor;


import com.did.entity.User;
import com.did.exception.AppException;
import com.did.util.JwtUtil;
import com.did.util.RedisServiceImpl;
import com.did.util.UserHolder;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.did.constant.RedisConstants.LOGIN_USER_KEY;


/**
 * @author lisihan
 * @Description 拦截器
 * @date 2023/5/29-20:39
 */
@Component
public class TokenInterceptor implements HandlerInterceptor {
    @Resource
    RedisServiceImpl redisService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String header = request.getHeader("Authorization");
        if (header != null && !"".equals(header)) {
            if (header.startsWith("Bearer ")) {
                //获得token
                String token = header.substring(7);
                System.out.println("token:" + token);
                //验证token
                Claims claims = JwtUtil.parseJwt(token);
                String url = request.getRequestURI();
                String username;
                try {
                    username = (String) claims.get("username");
                    System.out.println("username" + username);
                } catch (Exception e) {
                    throw new AppException("令牌已失效");
                }
                if (username != null) {
                    User user = (User) redisService.get(LOGIN_USER_KEY+username);
                    if (user != null) {
                        UserHolder.saveUser(user);
                        redisService.set(LOGIN_USER_KEY+user.getUsername(), user, LOGIN_USER_TTL);
                    }
                } else {
                    throw new AppException("令牌已失效");
                }
            }
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 移除用户
        UserHolder.removeUser();
    }

}
