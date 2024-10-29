package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private UserService userService;

    @Autowired
    private RecommendationService recommendationService;

    // 일반 추천 API
    @GetMapping
    public List<Festival> getRecommendations(Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return recommendationService.getRecommendations(user);
    }

    // 초기 선호를 기반으로 한 추천 API
    @GetMapping("/initial")
    public List<Festival> getInitialRecommendations(Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return recommendationService.getInitialRecommendations(user);
    }
}
