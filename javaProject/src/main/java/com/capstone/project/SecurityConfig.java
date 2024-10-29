package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

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
                .requestMatchers(
                    "/profile/upload",
                    "/profile/keywords",
                    "/api/users/register",
                    "/api/users/login",
                    "/profile/downloadImage",
                    "/",
                    "/initialUser",
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()
                .requestMatchers("/api/festivals", "/api/festivals/**").permitAll()
                .requestMatchers("/api/users/delete-account").authenticated()
                .anyRequest().authenticated()
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
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> 
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            );

        http.userDetailsService(userDetailsService);
        
        return http.build();
    }


    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 커스텀 로그아웃 핸들러 빈 설정
    @Bean
    public LogoutSuccessHandler customLogoutSuccessHandler() {
        return new CustomLogoutSuccessHandler();
    }
}
