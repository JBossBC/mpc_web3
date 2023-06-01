package com.did.interceptor;


import com.did.exception.AppException;
import com.did.util.UserHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author lisihan
 * @Description 登录拦截
 * @date 2023/5/29-20:38
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1.判断是否需要拦截（ThreadLocal中是否有用户）
        if (UserHolder.getUser() == null) {
            // 没有，需要拦截，设置状态码
            throw new AppException("你还没有登录");
            // 拦截
        }
        // 有用户，则放行
        return true;
    }
}
