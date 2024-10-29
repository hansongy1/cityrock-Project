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
            System.out.println("Logged in user email: " + userEmail);  // 디버깅 로그

            // 선호 키워드가 없는 경우
            boolean hasPreferences = userService.hasPreferences(userEmail);
            System.out.println("Has preferences: " + hasPreferences); // 디버깅 로그

            if (!hasPreferences) {
                String requestUri = request.getRequestURI();
                System.out.println("Request URI: " + requestUri); // 디버깅 로그
                // /initialUser 페이지로 리다이렉트 설정
                if (!requestUri.equals("/initialUser") && !requestUri.startsWith("/api/preferences")) {
                    System.out.println("Redirecting to /initialUser"); // 리다이렉트 로그
                    response.sendRedirect("/initialUser");
                    return false; // 요청 중단
                }
            }
        } else {
            System.out.println("User not logged in or Principal is null.");
        }

        return true; // 선호 키워드가 설정되어 있는 경우 정상적으로 요청 진행
    }
}
