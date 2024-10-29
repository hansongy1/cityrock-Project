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

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        if (session == null) return true;

        String currentUserEmail = (String) session.getAttribute("userEmail");

        if (currentUserEmail != null) {
            Boolean hasPreferences = (Boolean) session.getAttribute("hasPreferences");

            if (hasPreferences == null) {
                hasPreferences = userService.hasPreferences(currentUserEmail);
                session.setAttribute("hasPreferences", hasPreferences);
            }

            String requestUri = request.getRequestURI();
            if (!hasPreferences && !isExceptionPath(requestUri)) {
                response.sendRedirect("/initialUser");
                return false;
            }
        }

        return true;
    }

    private boolean isExceptionPath(String requestUri) {
        return requestUri.equals("/initialUser") || requestUri.startsWith("/api/preferences") || requestUri.equals("/error");
    }
}
