package com.capstone.project;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.security.Principal;


import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
// import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

@RestController
@RequestMapping("/api/festivals")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;

    @Autowired
    private UserService userService;

    @Autowired
    private RecommendationService recommendationService;


    // private static final String UPLOAD_DIR = "C:/uploads/";
    // 업로드 파일이 저장될 경로(VSCode 프로젝트 폴더 내부)
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    // 1. 축제 리스트 및 카테고리 필터링(JSON 데이터 반환)
    @GetMapping
    public List<Festival> getFestivals(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "sortOrder", required = false) String sortOrder,Model model) {

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

        // JSON 형식으로 축제 리스트 반환
        return festivals;
        // // 모델에 데이터 추가
        // model.addAttribute("festivals", festivals);
        // model.addAttribute("category", category);
        // model.addAttribute("region", region);
        // model.addAttribute("sortOrder", sortOrder);

        // // 카테고리 및 지역 리스트 전달
        // model.addAttribute("categories", Arrays.asList("전체", "음악", "먹거리", "꽃", "문화", "가족", "불꽃놀이"));
        // model.addAttribute("regions", Arrays.asList(
        //         "전체", "서울시", "부산시", "인천시", "대전시", "광주시",
        //         "대구시", "울산시", "세종시", "경기도", "강원도", "충청북도",
        //         "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"));

        // return "festival-list";
    }

    // 2. 개별 축제 세부 사항 보기(ver.15 수정)
    @GetMapping("/{id}")
    public ResponseEntity<Festival> getFestivalDetails(@PathVariable Long id, Principal principal) {
        Festival festival = festivalService.getFestivalById(id);
        if (festival == null) {
            return ResponseEntity.notFound().build();
        }

        if (principal != null) {
            String userEmail = principal.getName();
            userService.findByEmail(userEmail).ifPresent(user -> userService.addRecentFestival(user, festival));
        }

        return ResponseEntity.ok(festival);  // JSON 형식으로 개별 축제 반환
    }

    // 10.16 수정
    public Festival getFestivalDetails(@PathVariable Long id) {
        return festivalService.getFestivalById(id); // JSON 형식으로 개별 축제 반환
    }


    // 3. CSV 파일을 읽어 데이터베이스에 저장하는 로직 추가(아예 새로 추가)
    @PostMapping("/upload-csv")
    public String uploadCsvAndSaveToDatabase() {
        String fileName = "festival_data.csv";  // 업로드한 CSV 파일 이름
        Path filePath = Paths.get(UPLOAD_DIR + fileName);

        // 새로운 방식으로 CSVFormat을 설정
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build();

        try (FileReader reader = new FileReader(filePath.toString());
             CSVParser csvParser = new CSVParser(reader, csvFormat)) {

            for (CSVRecord csvRecord : csvParser) {
                // CSV 파일의 각 행을 Festival 객체로 변환
                Festival festival = new Festival();
                festival.setName(csvRecord.get("name"));
                festival.setLocation(csvRecord.get("location"));
                festival.setDate(csvRecord.get("date"));
                festival.setDescription(csvRecord.get("description"));
                festival.setPhone(csvRecord.get("phone"));
                festival.setCategory(csvRecord.get("category"));
                festival.setImage(csvRecord.get("image"));

                // 데이터베이스에 저장
                festivalService.save(festival);
            }

            return "CSV 파일이 성공적으로 처리되었습니다.";

        } catch (IOException e) {
            e.printStackTrace();
            return "CSV 파일 처리 중 오류가 발생했습니다.";
        }
    }

    @PostMapping("/updateRecent/{festivalId}")
    public ResponseEntity<String> updateRecentFestivals(@PathVariable Long festivalId, Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Festival festival = festivalService.getFestivalById(festivalId);
        recommendationService.updateRecentFestivals(user, festival);
        return ResponseEntity.ok("선호 축제 데이터가 업데이트되었습니다.");
    }

}