package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class PreferenceInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    private static final Set<String> EXCLUDED_PATHS = Set.of(
        "/login",
        "/register",
        "/initialUser",
        "/error",
        "/css/",
        "/js/",
        "/images/",
        "/static/"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String requestUri = request.getRequestURI();
        System.out.println("Request URI: " + requestUri);

        // 예외 경로 먼저 확인
        if (isExceptionPath(requestUri)) {
            System.out.println("Request URI is in exception paths. Proceeding without interception.");
            return true;
        }

        HttpSession session = request.getSession(false);

        if (session == null) {
            System.out.println("No session found. Proceeding without interception.");
            return true;
        }

        String currentUserEmail = (String) session.getAttribute("userEmail");
        if (currentUserEmail != null) {
            System.out.println("Logged in user email: " + currentUserEmail);

            Boolean hasPreferences = (Boolean) session.getAttribute("hasPreferences");
            if (hasPreferences == null) {
                hasPreferences = userService.hasPreferences(currentUserEmail);
                session.setAttribute("hasPreferences", hasPreferences);
                System.out.println("Fetched hasPreferences from DB: " + hasPreferences);
            } else {
                System.out.println("Fetched hasPreferences from session: " + hasPreferences);
            }

            if (!hasPreferences) {
                System.out.println("Redirecting to /initialUser");
                response.sendRedirect("/initialUser");
                return false;
            }
        } else {
            System.out.println("User not logged in or email attribute is null.");
        }

        return true;
    }

    private boolean isExceptionPath(String requestUri) {
        // 예외 경로에 해당하는 경우 true 반환
        if (EXCLUDED_PATHS.stream().anyMatch(requestUri::startsWith)) {
            return true;
        }

        // 모든 API 요청을 예외 처리
        if (requestUri.startsWith("/api/")) {
            return true;
        }

        return false;
    }
}


