package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 기존의 addViewControllers 메소드가 있다면 유지

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // API 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000")  // 허용할 출처 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);  // 세션 쿠키를 허용
    }

    //ver.13 추가
    @Autowired
    private PreferenceInterceptor preferenceInterceptor;

    //ver.13 추가
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(preferenceInterceptor)
                .excludePathPatterns("/login", "/register", "/css/**", "/js/**", "/images/**", "/initialUser");
    }
}