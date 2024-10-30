// ReviewController.java
package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.HttpSession;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/festivals")
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
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long festivalId, Model model, Principal principal) {
        Festival festival = festivalService.getFestivalById(festivalId);
        List<Review> reviews = reviewService.findByFestival(festival);

        // 로그인 여부 체크 로직
        if (principal != null) {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            reviews.forEach(review -> {
                boolean isScrapped = scrapService.isScrapped(user, review);
                review.setScrapped(isScrapped); // 리뷰 객체에 스크랩 여부 추가
            });
        }

        // model.addAttribute("reviews", reviews);
        // model.addAttribute("festival", festival);
        // return "review_list";

        return ResponseEntity.ok(reviews);  // JSON 데이터로 리스트 반환
    }


    // 리뷰 작성 페이지는 인증된 사용자만 접근 가능
    @GetMapping("/{festivalId}/reviews/add")
    public ResponseEntity<String> showAddReviewForm(@PathVariable Long festivalId, Model model, Principal principal) {
        // 로그인된 사용자만 접근 가능
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");  // 비로그인 사용자에게 401 상태 코드 반환
        }
        return ResponseEntity.ok("review_form");  // JSON 응답으로 리뷰 작성 페이지 반환
    }


    // 리뷰 작성 처리
    @PostMapping("/{festivalId}/reviews/add")
    public ResponseEntity<String> addReview(@PathVariable Long festivalId,
                            @RequestParam("rating") int rating,
                            @RequestParam("content") String content,
                            @RequestParam("keywords") List<String> keywords,
                            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                Principal principal) {

    	// 로그인된 사용자만 리뷰 작성 가능
        // String username = (String) session.getAttribute("username");
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");  // 비로그인 사용자는 401 상태 반환
        }

        try {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            Review review = new Review();
            review.setRating(rating);
            review.setContent(content);
            review.setKeywords(keywords);  // String.join(",", keywords) 대신 keywords 리스트 자체를 전달
            // review.setKeywords(String.join(",", keywords)); // 키워드 문자열로 변환

            if (!imageFile.isEmpty()) {
                Path filePath = Paths.get(UPLOAD_DIR + imageFile.getOriginalFilename());
                imageFile.transferTo(new File(filePath.toString()));
                review.setImage(imageFile.getOriginalFilename());
            }

            Festival festival = festivalService.getFestivalById(festivalId);
            review.setFestival(festival);
            review.setUser(user);

            reviewService.save(review);
            return ResponseEntity.ok("리뷰 작성이 완료되었습니다.");  // 리뷰 작성 완료 메시지 반환
        } 
        
        catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 작성 중 오류가 발생했습니다.");
        }
    	
        // try {
        //     // 로그인된 사용자 정보 가져오기
        //     String userEmail = principal.getName();
        //     User user = userService.findByUsername(username)
        //                   .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        //     // 로그로 사용자 정보 확인
        //     System.out.println("User name: " + username);
        //     System.out.println("User ID: " + user.getId());
            
        //     // 리뷰 생성
        //     Review review = new Review();
        //     review.setRating(rating);
        //     review.setContent(content);
        //     review.setKeywords(String.join(",", keywords)); // 키워드 문자열로 변환

        //     // 이미지 저장 처리
        //     if (!imageFile.isEmpty()) {
        //         Path filePath = Paths.get(UPLOAD_DIR + imageFile.getOriginalFilename());
        //         imageFile.transferTo(new File(filePath.toString()));

        //         // DB에는 상대 경로만 저장
        //         review.setImage(imageFile.getOriginalFilename());  // 여기서 절대 경로가 아닌 파일 이름만 저장
        //     }


        //     // 축제 및 사용자 정보 설정
        //     Festival festival = festivalService.getFestivalById(festivalId);
        //     review.setFestival(festival);
        //     review.setUser(user); // 사용자 정보 설정
            
        //     // 로그로 축제 정보와 리뷰 정보 확인
        //     System.out.println("Festival ID: " + festival.getId());
        //     System.out.println("Review Rating: " + review.getRating());
        //     System.out.println("Review Content: " + review.getContent());

        //     // 리뷰 저장
        //     reviewService.save(review);

        // } catch (IOException e) {
        //     e.printStackTrace();
        // }

        // return "redirect:/festivals/" + festivalId + "/reviews";
    }
    
    // 스크랩 토글 처리 (비로그인 사용자는 로그인 페이지로 리디렉트)
    @PostMapping("/{festivalId}/reviews/{reviewId}/scrap")
    public ResponseEntity<?> toggleScrap(@PathVariable Long festivalId, @PathVariable Long reviewId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Review review = reviewService.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        boolean isScrapped;
        if (scrapService.isScrapped(user, review)) {
            scrapService.unscrapReview(user, review);
            isScrapped = false;
        } else {
            scrapService.scrapReview(user, review);
            isScrapped = true;
        }

        // 스크랩 상태를 JSON으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("isScrapped", isScrapped);
        return ResponseEntity.ok(response);
    }

}
