package com.capstone.project;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    @Autowired
    private FestivalRepository festivalRepository;

    public List<Festival> getRecommendations(User user) {
        Set<String> preferredCategories = user.getPreferences();
        List<Festival> recentFestivals = user.getRecentFestivals();

        // 추천 리스트
        List<Festival> recommendations = new ArrayList<>();

        // 최근 본 축제의 카테고리 수집
        Set<String> recentCategories = recentFestivals.stream()
                .map(Festival::getCategory)
                .collect(Collectors.toSet());

        // 초기에는 선호 카테고리와 최근 카테고리를 모두 사용
        Set<String> categoriesForRecommendation = new HashSet<>();

        if (recentFestivals.size() < 10) {
            categoriesForRecommendation.addAll(preferredCategories);
        }

        categoriesForRecommendation.addAll(recentCategories);

        // 해당 카테고리의 축제 중에서 이미 본 축제를 제외하고 추천 리스트 생성
        List<Festival> potentialFestivals = festivalRepository.findByCategoryIn(categoriesForRecommendation);

        // 이미 본 축제는 제외
        potentialFestivals.removeAll(recentFestivals);

        // 랜덤으로 정렬하여 상위 3개 추천
        Collections.shuffle(potentialFestivals);
        recommendations = potentialFestivals.stream()
                .limit(3)
                .collect(Collectors.toList());

        return recommendations;
    }
}
