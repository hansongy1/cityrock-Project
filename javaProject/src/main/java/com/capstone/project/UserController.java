package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.ui.Model; // Model 클래스
import java.util.List; // List 클래스

import jakarta.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private ScrapService scrapService;

    // 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.saveUser(user);  // 사용자 저장
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원가입 성공");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "회원가입 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            // 사용자 정보 가져오기
            User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // 사용자의 선호도 여부 확인
            boolean hasPreferences = user.getPreferences() != null && !user.getPreferences().isEmpty();

            // 선호도 상태를 응답에 포함시킴
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("username", user.getUsername());
            response.put("hasPreferences", String.valueOf(hasPreferences)); // true 또는 false 반환

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "로그인 실패");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }



    // 로그아웃 엔드포인트
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.invalidate();  // 세션 무효화
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 계정 삭제 엔드포인트
    @PostMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(Principal principal, HttpSession session) {
        String userEmail = principal.getName();
        Optional<User> userOptional = userService.findByEmail(userEmail);

        if (!userOptional.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = userOptional.get();

        try {
            // 유저 탈퇴 처리
            userService.deleteUser(user.getId());

            // 세션 무효화 및 보안 컨텍스트 클리어
            session.invalidate();
            SecurityContextHolder.clearContext();

            // 성공 응답
            return ResponseEntity.ok(Map.of("message", "탈퇴되었습니다."));
        } catch (Exception e) {
            // 오류 응답
            Map<String, String> error = new HashMap<>();
            error.put("message", "탈퇴 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // 로그인 상태 확인 엔드포인트
    @GetMapping("/check-login")
    public ResponseEntity<Void> checkLoginStatus(Principal principal) {
        if (principal != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/home")
    public String home(Model model, Principal principal) {
        if (principal != null) {
            String userEmail = principal.getName();
            User user = userService.findByEmail(userEmail).orElse(null);

            if (user != null) {
                List<Festival> recommendations = recommendationService.getRecommendations(user);
                model.addAttribute("recommendations", recommendations);
            }
        }

        return "home"; // 홈 페이지 템플릿
    }

    // status - 후기
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getUserStatus(Principal principal) {
        System.out.println("Entered /api/users/status endpoint"); // 로그 추가
        Map<String, Object> response = new HashMap<>();
        try {
            if (principal != null && principal.getName() != null) {
                System.out.println("Principal name: " + principal.getName()); // 로그 추가
                String userEmail = principal.getName();
                User user = userService.findByEmail(userEmail)
                        .orElse(null);
                if (user != null) {
                    response.put("isLoggedIn", true);
                    response.put("username", user.getUsername());
                } else {
                    System.out.println("User not found with email: " + userEmail); // 로그 추가
                    response.put("isLoggedIn", false);
                }
            } else {
                System.out.println("Principal is null or principal.getName() is null"); // 로그 추가
                response.put("isLoggedIn", false);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 트레이스 출력
            response.put("isLoggedIn", false);
            response.put("error", "An error occurred while checking user status.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 사용자가 스크랩한 리뷰 목록을 가져오는 API
    @GetMapping("/scrapped-reviews")
    public ResponseEntity<?> getScrappedReviews(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        List<Review> scrappedReviews = scrapService.getScrappedReviewsByUser(user);

        // Review 엔티티를 그대로 반환하면 순환 참조 문제가 발생할 수 있으므로, 필요한 필드만 포함하도록 합니다.
        // 또는 ReviewDTO를 사용할 수 있습니다.
        // 여기서는 간단하게 필요한 필드만 포함하도록 Map을 사용합니다.

        List<Map<String, Object>> response = scrappedReviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("rating", review.getRating());
            map.put("content", review.getContent());
            map.put("image", review.getImage());
            map.put("keywords", review.getKeywords());
            map.put("scrapped", true); // 항상 스크랩된 상태
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}