package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.CrossOrigin;
// // import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import java.util.Map;
import java.security.Principal;
import java.util.HashMap;
import java.util.Optional;



@RestController
@RequestMapping("/api/users")
// @Controller
// @CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 주소로 변경
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


    // 2 - 10.08 수정
    // @PostMapping("/login")
    // public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
    //     Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());
    //     if (userOptional.isPresent()) {
    //         User user = userOptional.get();
    //         if (userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
    //             session.setAttribute("username", user.getUsername());  // 세션에 사용자 이름 저장
    //             Map<String, String> response = new HashMap<>();
    //             response.put("message", "로그인 성공");
    //             response.put("username", user.getUsername());  // 응답으로도 사용자 이름 전송
    //             return ResponseEntity.ok(response);
    //         } else {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "비밀번호가 일치하지 않습니다."));
    //         }
    //     } else {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자를 찾을 수 없습니다."));
    //     }
    // }

    // 10-09 수정 - 안 되면 위에 있는 걸로 백
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // AuthenticationManager를 사용하여 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // 인증이 성공하면 SecurityContext에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // SecurityContext를 세션에 저장 - 10.10 수정 추가
            // session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());        

            // 사용자 정보 가져오기
            User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            // 세션에 사용자 이름 저장
            session.setAttribute("username", user.getUsername());

            // 성공 응답 준비
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            // 사용자를 찾을 수 없는 경우
            Map<String, String> error = new HashMap<>();
            error.put("message", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            // 비밀번호 불일치 등 기타 오류
            Map<String, String> error = new HashMap<>();
            error.put("message", "비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }


    // 로그아웃 - 10.08 수정
    // @PostMapping("/logout")
    // public ResponseEntity<String> logoutUser(HttpSession session) {
    //     System.out.println("로그아웃 메서드 호출됨");  // 로그 출력
    //     session.invalidate();  // 세션 무효화
    //     return ResponseEntity.ok("로그아웃 성공");
    // }
    // public String logoutUser(HttpSession session) {
    //     session.invalidate();  // 세션 무효화
    //     return "redirect:/login";  // 로그아웃 후 로그인 페이지로 리디렉션
    // }


    // @PostMapping("/delete-account")
    // public String deleteAccount() {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     String email = authentication.getName();  // 현재 로그인된 사용자의 이메일 가져오기
    //     userService.deleteUserByEmail(email);  // 사용자 삭제
    //     SecurityContextHolder.clearContext();  // 로그아웃 처리
    //     return "redirect:/login?accountDeleted";
    // }

    // 10-09 새 버전
    // @PostMapping("/delete-account")
    // public String deleteAccount(Principal principal) {
    //     String userEmail = principal.getName();
    //     User user = userService.findByEmail(userEmail)
    //         .orElseThrow(() -> new IllegalArgumentException("User not found"));

    //     // 유저 탈퇴 처리
    //     userService.deleteUser(user.getId());

    //     // 로그아웃 후 홈 페이지로 리다이렉트
    //     return "redirect:/login?logout=true";
    // }

    // 10-09 수정
    // 탈퇴 엔드포인트 수정
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/delete-account")
    // @PostMapping("/api/user/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(Principal principal, HttpSession session) {
        // 사용자 인증 정보 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("인증되지 않은 사용자입니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "인증되지 않았습니다."));
        }
        
        System.out.println("탈퇴 요청이 서버에 도달했습니다."); // 로그 추가
        String userEmail = principal.getName();
        System.out.println("탈퇴 요청 처리 중: " + userEmail); // 로그 추가

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
            // Map<String, String> response = new HashMap<>();
            // response.put("message", "탈퇴되었습니다.");
            // return ResponseEntity.ok(response);
            return ResponseEntity.ok(Map.of("message", "탈퇴되었습니다."));
        } catch (Exception e) {
            // 오류 응답
            Map<String, String> error = new HashMap<>();
            error.put("message", "탈퇴 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
