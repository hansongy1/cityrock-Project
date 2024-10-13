package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/festivals")
public class ReviewController {


    @Autowired
    private ReviewService reviewService;

    @Autowired
    private FestivalService festivalService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private ScrapService scrapService;
    

    private static final String UPLOAD_DIR = "C:/uploads/";

    // 리뷰 리스트 페이지로 이동
    @GetMapping("/{festivalId}/reviews")
    public String getReviews(@PathVariable Long festivalId, Model model, Principal principal) {
        Festival festival = festivalService.getFestivalById(festivalId);
        List<Review> reviews = reviewService.findByFestival(festival);

        if (principal != null) {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            reviews.forEach(review -> {
                boolean isScrapped = scrapService.isScrapped(user, review);
                review.setScrapped(isScrapped); // 리뷰 객체에 스크랩 여부 추가
            });
        }

        model.addAttribute("reviews", reviews);
        model.addAttribute("festival", festival);
        return "review_list";
    }


    // 리뷰 작성 페이지는 인증된 사용자만 접근 가능
    @GetMapping("/{festivalId}/reviews/add")
    public String showAddReviewForm(@PathVariable Long festivalId, Model model, Principal principal) {
        // 로그인된 사용자만 접근 가능
        if (principal == null) {
            return "redirect:/login";  // 비로그인 사용자는 로그인 페이지로 리디렉션
        }

        model.addAttribute("festivalId", festivalId);
        return "review_form";
    }


    // 리뷰 작성 처리
    @PostMapping("/{festivalId}/reviews/add")
    public String addReview(@PathVariable Long festivalId,
                            @RequestParam("rating") int rating,
                            @RequestParam("content") String content,
                            @RequestParam("keywords") List<String> keywords,
                            @RequestParam("imageFile") MultipartFile imageFile,
                            Principal principal, Model model) {

    	// 로그인된 사용자만 리뷰 작성 가능
        if (principal == null) {
            return "redirect:/login";  // 비로그인 사용자는 로그인 페이지로 리디렉트
        }
    	
        try {
            // 로그인된 사용자 정보 가져오기
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail)
                          .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            // 로그로 사용자 정보 확인
            System.out.println("User email: " + userEmail);
            System.out.println("User ID: " + user.getId());
            
            // 리뷰 생성
            Review review = new Review();
            review.setRating(rating);
            review.setContent(content);
            review.setKeywords(String.join(",", keywords)); // 키워드 문자열로 변환

            // 이미지 저장 처리
            if (!imageFile.isEmpty()) {
                Path filePath = Paths.get(UPLOAD_DIR + imageFile.getOriginalFilename());
                imageFile.transferTo(new File(filePath.toString()));

                // DB에는 상대 경로만 저장
                review.setImage(imageFile.getOriginalFilename());  // 여기서 절대 경로가 아닌 파일 이름만 저장
            }


            // 축제 및 사용자 정보 설정
            Festival festival = festivalService.getFestivalById(festivalId);
            review.setFestival(festival);
            review.setUser(user); // 사용자 정보 설정
            
            // 로그로 축제 정보와 리뷰 정보 확인
            System.out.println("Festival ID: " + festival.getId());
            System.out.println("Review Rating: " + review.getRating());
            System.out.println("Review Content: " + review.getContent());

            // 리뷰 저장
            reviewService.save(review);

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "redirect:/festivals/" + festivalId + "/reviews";
    }
    
    // 스크랩 토글 처리 (비로그인 사용자는 로그인 페이지로 리디렉트)
    @PostMapping("/{festivalId}/reviews/{reviewId}/scrap")
    public String toggleScrap(@PathVariable Long festivalId, @PathVariable Long reviewId, Principal principal) {
        if (principal == null) {
            return "redirect:/login";  // 비로그인 사용자는 로그인 페이지로 리디렉트
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Review review = reviewService.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (scrapService.isScrapped(user, review)) {
            scrapService.unscrapReview(user, review);
        } else {
            scrapService.scrapReview(user, review);
        }

        return "redirect:/festivals/" + festivalId + "/reviews";
    }

}
