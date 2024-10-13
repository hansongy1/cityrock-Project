package com.capstone.project;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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

    private static final String UPLOAD_DIR = "C:/uploads/";

    // 1. 축제 리스트 및 카테고리 필터링
    @GetMapping
    public String getFestivals(@RequestParam(value = "category", required = false) String category, Model model) {
        List<Festival> festivals;
        if (category == null || category.equals("전체")) {
            festivals = festivalService.getAllFestivals();
        } else {
            festivals = festivalService.getFestivalsByCategory(category);
        }
        model.addAttribute("festivals", festivals);
        model.addAttribute("category", category);
        model.addAttribute("categories", List.of("전체", "음악", "먹거리", "꽃", "문화", "가족", "불꽃놀이"));
        return "festival-list";
    }

    // 2. 개별 축제 세부 사항 보기
    @GetMapping("/{id}")
    public String getFestivalDetails(@PathVariable Long id, Model model) {
        Festival festival = festivalService.getFestivalById(id);
        model.addAttribute("festival", festival);
        return "festival-detail"; // 템플릿 파일 이름과 일치
    }


    // 3. 축제 등록 페이지 보기
    @GetMapping("/add")
    public String showAddFestivalForm(Model model) {
        model.addAttribute("festival", new Festival());
        return "festival-upload"; // 축제 등록 폼 페이지로 이동
    }

    // 4. 축제 등록 처리
    @PostMapping("/add")
    public String addFestival(@RequestParam("name") String name,
                              @RequestParam("date") String date,
                              @RequestParam("location") String location,
                              @RequestParam("imageFile") MultipartFile imageFile, Model model) {
        try {
            // 이미지 파일을 서버에 저장
            Path filePath = Paths.get(UPLOAD_DIR + imageFile.getOriginalFilename());
            imageFile.transferTo(new File(filePath.toString()));

            // 축제 정보를 DB에 저장 (이미지는 파일 경로를 저장)
            Festival festival = new Festival();
            festival.setName(name);
            festival.setDate(date);
            festival.setLocation(location);
            festival.setImage(filePath.toString()); // 이미지 경로 저장

            festivalService.save(festival);

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "redirect:/festivals"; // 등록 후 축제 리스트 페이지로 리다이렉트
    }
}
