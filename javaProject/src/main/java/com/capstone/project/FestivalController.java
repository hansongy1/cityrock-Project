package com.capstone.project;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;


@Controller
@RequestMapping("/festivals")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "C:/uploads/";

    // 1. 축제 리스트 및 카테고리 필터링
    @GetMapping
    public String getFestivals(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "sortOrder", required = false) String sortOrder,
            Model model) {

        List<Festival> festivals;

        // 카테고리 필터링
        if (category == null || category.equals("전체")) {
            festivals = festivalService.getAllFestivals();
        } else {
            festivals = festivalService.getFestivalsByCategory(category);
        }

        // 지역 필터링
        if (region != null && !region.equals("전체")) {
            String finalRegion = region.replace("시", "").replace("특별자치도", "").replace("특별시", "");
            String[] regionKeywords = { finalRegion, region };
            festivals = festivals.stream()
                    .filter(festival -> {
                        for (String keyword : regionKeywords) {
                            if (festival.getLocation().contains(keyword)) {
                                return true;
                            }
                        }
                        return false;
                    })
                    .collect(Collectors.toList());  // 수정 가능한 리스트로 변환
        }

        // 정렬 처리 (기본값은 오름차순)
        if (sortOrder == null || sortOrder.equals("오름차순")) {
            festivals.sort(Comparator.comparing(Festival::getName));
        } else if (sortOrder.equals("내림차순")) {
            festivals.sort(Comparator.comparing(Festival::getName).reversed());
        }

        // 모델에 데이터 추가
        model.addAttribute("festivals", festivals);
        model.addAttribute("category", category);
        model.addAttribute("region", region);
        model.addAttribute("sortOrder", sortOrder);

        // 카테고리 및 지역 리스트 전달
        model.addAttribute("categories", Arrays.asList("전체", "음악", "먹거리", "꽃", "문화", "가족", "불꽃놀이"));
        model.addAttribute("regions", Arrays.asList(
                "전체", "서울시", "부산시", "인천시", "대전시", "광주시",
                "대구시", "울산시", "세종시", "경기도", "강원도", "충청북도",
                "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"));

        return "festival-list";
    }

    // 2. 개별 축제 세부 사항 보기(ver.15 수정)
    @GetMapping("/{id}")
    public String getFestivalDetails(@PathVariable Long id, Model model, Principal principal) {
        Festival festival = festivalService.getFestivalById(id);
        model.addAttribute("festival", festival);

        // 사용자 활동 기록
        if (principal != null) {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail)
                    .orElse(null);

            if (user != null) {
                userService.addRecentFestival(user, festival);
            }
        }

        return "festival-detail"; // 템플릿 파일 이름과 일치
    }
}
