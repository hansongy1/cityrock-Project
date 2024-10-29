package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
=======
import org.springframework.ui.Model; // Model 클래스
import java.util.List; // List 클래스

>>>>>>> 226333f53486d22256554fa308194e369700f08e
import jakarta.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RecommendationService recommendationService;

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
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
<<<<<<< HEAD

            // SecurityContext를 세션에 저장
            HttpSession session = request.getSession(true);
=======
>>>>>>> 226333f53486d22256554fa308194e369700f08e
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            // 현재 로그인한 사용자의 이메일을 세션에 저장
            String userEmail = loginRequest.getEmail();
            session.setAttribute("userEmail", userEmail);

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
            Map<String, String> response = new HashMap<>();
            response.put("message", "탈퇴되었습니다.");
            return ResponseEntity.ok(response);
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
}
