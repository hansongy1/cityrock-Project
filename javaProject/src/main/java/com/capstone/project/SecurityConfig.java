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

    // AuthenticationManager 빈 설정 - 10.09 추가
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 보안 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 비활성화 (REST API에서는 일반적으로 비활성화)
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // cors 설정을 추가
    
            // .cors(withDefaults())  // CORS 설정 추가

            // 요청에 대한 보안 설정
            // .authorizeHttpRequests(authorize -> authorize
            //     // 회원가입과 로그인 엔드포인트는 누구나 접근 가능
            //     .requestMatchers("/api/users/register", "/api/users/login", "/api/users/logout", "/", "/login").permitAll()
            //     // 그 외의 모든 요청은 인증 필요
            //     .anyRequest().authenticated()
            // )
            // 요청에 대한 보안 설정
            .authorizeHttpRequests(authorize -> authorize
                // 회원가입과 로그인 엔드포인트는 누구나 접근 가능
                .requestMatchers("/api/users/register", "/api/users/login", "/api/users/logout", "/", "/login").permitAll()
                // 탈퇴 엔드포인트는 인증된 사용자만 접근 가능
                .requestMatchers("/api/users/delete-account").authenticated()
                // 그 외의 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )

            // 폼 로그인 비활성화하여 /login으로 리다이렉트되는 것 방지
            .formLogin(form -> form.disable())

            // HTTP Basic 인증 비활성화 (선택 사항)
            .httpBasic(basic -> basic.disable())

            // 로그아웃 설정 추가 - 10.08 수정
            .logout(logout -> logout
                .logoutUrl("/api/users/logout")  // 로그아웃 경로
                .logoutSuccessHandler(customLogoutSuccessHandler()) // 커스터마이징된 로그아웃 핸들러 설정
                .logoutSuccessUrl("/login")  // 로그아웃 성공 시 리디렉션
                .invalidateHttpSession(true)  // 세션 무효화
                .clearAuthentication(true)  // 인증 정보 클리어
                .deleteCookies("JSESSIONID")  // 쿠키 삭제
                .permitAll() // 로그아웃에 대한 접근 허용
            )

            // 세션 관리 설정 추가
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)  // 필요한 경우에만 세션 생성
            )
            
            // 세션 관리 설정 추가 - 10.08 수정
            .sessionManagement(session -> session
                .maximumSessions(1)  // 동시에 하나의 세션만 허용
                .expiredUrl("/login?expired=true")  // 세션 만료 시 리디렉션
                // .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)  // 필요한 경우 세션 생성
            )


            // 사용자 인증 서비스 설정
            .userDetailsService(userDetailsService);
            

        return http.build();
    }

    // CORS 설정을 위한 메서드 추가
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

    // 커스터마이징된 로그아웃 핸들러 빈 설정
    @Bean
    public LogoutSuccessHandler customLogoutSuccessHandler() {
        return new CustomLogoutSuccessHandler();
    }
    
}
