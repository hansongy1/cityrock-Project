package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// Spring Security 관련 임포트
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
// 비밀번호 인코더 관련 임포트
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // 비밀번호 인코더 빈 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 보안 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 비활성화 (REST API에서는 일반적으로 비활성화)
            .csrf(csrf -> csrf.disable())

            // 요청에 대한 보안 설정
            .authorizeHttpRequests(authorize -> authorize
                // 회원가입과 로그인 엔드포인트는 누구나 접근 가능
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                // 그 외의 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )

            // 폼 로그인 비활성화하여 /login으로 리다이렉트되는 것 방지
            .formLogin(form -> form.disable())

            // HTTP Basic 인증 비활성화 (선택 사항)
            .httpBasic(basic -> basic.disable())

            // 사용자 인증 서비스 설정
            .userDetailsService(userDetailsService);

        return http.build();
    }
}
