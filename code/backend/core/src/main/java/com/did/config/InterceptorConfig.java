package com.did.config;


import com.did.interceptor.LoginInterceptor;
import com.did.interceptor.TokenInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author lisihan
 * @Description 拦截器配置类
 * @date 2023/5/29-20:37
 */
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

    private final TokenInterceptor tokenInterceptor;
    private final LoginInterceptor loginInterceptor;

    public InterceptorConfig(TokenInterceptor tokenInterceptor, LoginInterceptor loginInterceptor) {
        this.tokenInterceptor = tokenInterceptor;
        this.loginInterceptor = loginInterceptor;
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //拦截所有目录，除了通向login和register的接口
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/**/login")
                .excludePathPatterns("/**/register")
                .excludePathPatterns("/**/getCode")
                .excludePathPatterns("/**/getCode1")
                .excludePathPatterns("/**/getPK")
                .excludePathPatterns("/**/create")
                .excludePathPatterns("/**/forgetPassword")
                .excludePathPatterns("/**/*.html", "/**/*.js", "/**/*.css")
                .excludePathPatterns("/swagger-ui.html")
                .excludePathPatterns("/swagger-resources/**")
                .excludePathPatterns("/error")
                .excludePathPatterns("/webjars/**").order(1);
        registry.addInterceptor(tokenInterceptor).addPathPatterns("/**").order(0);
    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //将templates目录下的CSS、JS文件映射为静态资源，防止Spring把这些资源识别成thymeleaf模版
        registry.addResourceHandler("/templates/**.js").addResourceLocations("classpath:/templates/");
        registry.addResourceHandler("/templates/**.css").addResourceLocations("classpath:/templates/");
        //其他静态资源
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        //swagger增加url映射
        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
