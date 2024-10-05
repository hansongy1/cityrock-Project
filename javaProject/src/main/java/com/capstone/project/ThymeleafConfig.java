package com.capstone.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring6.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;

@Configuration
public class ThymeleafConfig {
	// 템플릿 리졸버 설정
    @Bean
    public SpringResourceTemplateResolver templateResolver() {
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setPrefix("classpath:/templates/");  // 템플릿 경로 설정
        templateResolver.setSuffix(".html");                  // 템플릿 파일 확장자 설정
        templateResolver.setTemplateMode(TemplateMode.HTML);  // 템플릿 모드 설정
        templateResolver.setCharacterEncoding("UTF-8");       // 인코딩 설정
        templateResolver.setCacheable(false);                 // 캐시 비활성화
        return templateResolver;
    }

    // 템플릿 엔진 설정
    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());  // 위에서 설정한 리졸버 사용
        return templateEngine;
    }

    // 뷰 리졸버 설정
    @Bean
    public ThymeleafViewResolver viewResolver() {
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setTemplateEngine(templateEngine());
        viewResolver.setCharacterEncoding("UTF-8");  // 인코딩 설정
        return viewResolver;
    }
}
