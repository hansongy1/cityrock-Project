package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/mypage")
public class MyPageController {

    @Autowired
    private UserService userService;

    @Autowired
    private ScrapService scrapService;

    private static final String PROFILE_IMAGE_DIR = "C:/profile/";

    // 마이페이지 메인 화면
    @GetMapping
    public String myPage(Model model, Principal principal) {
        // 비로그인 상태인 경우
        if (principal == null) {
            model.addAttribute("user", null); // 비로그인 상태에선 null로 설정
            return "mypage";  // 마이페이지 템플릿으로 이동
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail).orElse(null);

        if (user != null) {
            model.addAttribute("user", user);
        }

        return "mypage";  // 마이페이지 템플릿으로 이동
    }

    // 프로필 수정 페이지 표시
    @GetMapping("/editProfile")
    public String editProfileForm(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";  // 비로그인 사용자는 로그인 페이지로 리디렉트
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail).orElse(null);

        if (user != null) {
            model.addAttribute("user", user);
        }

        return "edit_profile";  // 프로필 수정 페이지로 이동
    }

    // 프로필 수정 처리
    @PostMapping("/editProfile")
    public String editProfile(@RequestParam("profileImage") MultipartFile profileImage, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail).orElse(null);

        if (user != null) {
            // 기존 프로필 이미지 삭제 (기존 이미지가 있는 경우만)
            if (user.getProfileImage() != null) {
                Path oldImagePath = Paths.get(PROFILE_IMAGE_DIR + user.getProfileImage());
                try {
                    Files.deleteIfExists(oldImagePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            // 새로운 프로필 이미지 저장
            if (!profileImage.isEmpty()) {
                try {
                    String filename = "profile_" + user.getId() + "_" + profileImage.getOriginalFilename();
                    Path filePath = Paths.get(PROFILE_IMAGE_DIR + filename);
                    profileImage.transferTo(filePath.toFile());

                    user.setProfileImage(filename);  // 사용자에게 새 이미지 경로 설정
                    userService.save(user);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return "redirect:/mypage";
    }

    // 스크랩한 게시물 페이지 표시
    @GetMapping("/scrappedReviews")
    public String scrappedReviews(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail).orElse(null);

        if (user != null) {
            List<Review> scrappedReviews = scrapService.getScrappedReviewsByUser(user);
            model.addAttribute("reviews", scrappedReviews);
        }

        return "scrapped_reviews";  // 스크랩한 게시물 페이지로 이동
    }
}
