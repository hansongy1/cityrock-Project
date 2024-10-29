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
                // 조건 추가: /initialUser 페이지가 아닌 경우에만 리다이렉트
                if (!requestUri.equals("/initialUser") && !requestUri.startsWith("/api/preferences")) {
                    System.out.println("Redirecting to /initialUser: " + userEmail); // 로그로 리다이렉트 확인
                    response.sendRedirect("/initialUser");
                    return false; // 요청 중단
                }
            } else {
                System.out.println("Preferences found, proceeding with request.");
            }
        } else {
            System.out.println("User not logged in or Principal is null.");
        }

        return true; // 선호 키워드가 설정되어 있는 경우 정상적으로 요청 진행
    }
}
