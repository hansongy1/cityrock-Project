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
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
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
            // AuthenticationManager를 사용하여 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // 인증이 성공하면 SecurityContext에 인증 정보 저장
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            // SecurityContext를 세션에 저장
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            // 현재 로그인한 사용자의 이메일을 세션에 저장
            String userEmail = loginRequest.getEmail();
            session.setAttribute("userEmail", userEmail);

            // 선호 키워드 유무 확인 후 세션에 저장
            boolean hasPreferences = userService.hasPreferences(userEmail);
            session.setAttribute("hasPreferences", hasPreferences);

            // 로그인 성공 메시지와 hasPreferences 반환
            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("hasPreferences", hasPreferences);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "서버 오류로 인해 로그인할 수 없습니다.");
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
}
