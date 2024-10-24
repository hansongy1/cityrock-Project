package com.capstone.project;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.Principal;

//ver.13
@Component
public class PreferenceInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        Principal principal = request.getUserPrincipal();

        if (principal != null) {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail).orElse(null);

            if (user != null) {
                // 컬렉션 초기화
                Hibernate.initialize(user.getPreferences());

                if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
                    // 선호 축제가 저장되어 있지 않으면 리다이렉트
                    if (!request.getRequestURI().startsWith("/preferences")) {
                        response.sendRedirect("/preferences/select");
                        return false;
                    }
                }
            }
        }

        return true;
    }
}
