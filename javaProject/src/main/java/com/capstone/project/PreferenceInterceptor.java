package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.Principal;

@Component
public class PreferenceInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Principal principal = request.getUserPrincipal();

        // 로그인한 사용자인 경우
        if (principal != null) {
            String userEmail = principal.getName();

            // 사용자가 선호 키워드를 설정하지 않았다면 /initialUser로 리다이렉트
            if (!userService.hasPreferences(userEmail)) {
                String requestUri = request.getRequestURI();

                // /initialUser 또는 관련 API로의 요청이 아닌 경우만 리다이렉트
                if (!requestUri.equals("/initialUser") && !requestUri.startsWith("/api/preferences")) {
                    System.out.println("Redirecting to /initialUser for user: " + userEmail); // 로그로 리다이렉트 확인
                    response.sendRedirect("/initialUser");
                    return false; // 요청 중단
                }
            }
        }
        return true; // 선호 키워드가 설정되어 있는 경우 요청 계속 진행
    }
}
