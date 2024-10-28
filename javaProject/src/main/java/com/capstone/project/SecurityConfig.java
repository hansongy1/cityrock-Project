package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// Spring Security 관련 임포트
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
// 비밀번호 인코더 관련 임포트
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
// CORS 설정을 위한 추가된 임포트
import org.springframework.web.cors.CorsConfiguration;  // CORS 설정을 위한 클래스
import org.springframework.web.cors.CorsConfigurationSource;  // CORS 설정 소스 클래스
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;  // URL을 기반으로 한 CORS 설정 소스

import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // 비밀번호 인코더 빈 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager 빈 설정
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // SecurityFilterChain 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/profile/upload", "/profile/keywords", "/api/users/register", "/api/users/login", "/profile/downloadImage", "/").permitAll() // 접근 허용
                .requestMatchers("/api/festivals", "/api/festivals/**").permitAll() // 축제 API 허용
                .requestMatchers("/api/users/delete-account").authenticated() // 탈퇴 엔드포인트는 인증 필요
                .anyRequest().authenticated() // 나머지 모든 요청은 인증 필요
            )
            .formLogin(form -> form.disable()) // 폼 로그인 비활성화
            .httpBasic(basic -> basic.disable()) // HTTP Basic 인증 비활성화
            .logout(logout -> logout
                .logoutUrl("/api/users/logout") // 로그아웃 경로 설정
                .logoutSuccessHandler(customLogoutSuccessHandler()) // 커스텀 로그아웃 핸들러
                .invalidateHttpSession(true) // 세션 무효화
                .clearAuthentication(true) // 인증 정보 클리어
                .deleteCookies("JSESSIONID") // JSESSIONID 쿠키 삭제
                .permitAll() // 로그아웃 접근 허용
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션 관리 정책 설정
                .maximumSessions(1) // 최대 세션 수 제한
                .expiredUrl("/login?expired=true") // 세션 만료 시 리디렉션 설정
            )
            .userDetailsService(userDetailsService); // 사용자 인증 서비스 설정
    
        return http.build();
    }

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");  // 허용할 출처 설정
        configuration.addAllowedMethod("*");  // 모든 메서드 허용
        configuration.addAllowedHeader("*");  // 모든 헤더 허용
        configuration.setAllowCredentials(true);  // 인증된 요청 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // 모든 경로에 대해 CORS 설정 적용
        return source;
    }

    // 커스텀 로그아웃 핸들러 빈 설정
    @Bean
    public LogoutSuccessHandler customLogoutSuccessHandler() {
        return new CustomLogoutSuccessHandler();
    }
}
