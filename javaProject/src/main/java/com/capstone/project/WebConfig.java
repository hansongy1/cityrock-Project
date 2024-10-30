package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    //ver.13 추가
    @Autowired
    private PreferenceInterceptor preferenceInterceptor;

    //ver.13 추가
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(preferenceInterceptor)
                .addPathPatterns("/", "/mypage", "/**")  // 필요한 경로 추가
                .excludePathPatterns("/login", "/register", "/initialUser", "/css/**", "/js/**", "/images/**");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/initialUser").setViewName("forward:/index.html");
    }

    // 정적 리소스 핸들러 추가
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/uploads/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // API 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000")  // 허용할 출처 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);  // 세션 쿠키를 허용
    }
}