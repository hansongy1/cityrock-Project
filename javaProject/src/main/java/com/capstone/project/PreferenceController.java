package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.security.Principal;
import java.util.Set;

@RestController  // @Controller 대신 @RestController 사용
@RequestMapping("/api/preferences")
public class PreferenceController {

    @Autowired
    private UserService userService;

    // 선호 키워드 가져오기
    @GetMapping
    public ResponseEntity<Set<String>> getPreferences(Principal principal) {
        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return ResponseEntity.ok(user.getPreferences());
    }

    // 선호 키워드 저장
    @PostMapping("/save")
    public ResponseEntity<?> savePreferences(@RequestBody Set<String> preferences, Principal principal) {
        if (preferences.size() < 1 || preferences.size() > 3) {
            return ResponseEntity.badRequest().body("Preferences must be between 1 and 3.");
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        user.setPreferences(preferences);
        userService.save(user);

        return ResponseEntity.ok().body("Preferences saved.");
    }
}
