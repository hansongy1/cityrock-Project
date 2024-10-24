package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

//ver.13
@Controller
@RequestMapping("/preferences")
public class PreferenceController {

    @Autowired
    private UserService userService;

    // 선호 축제 선택 페이지 표시
    @GetMapping("/select")
    public String showPreferenceSelection(Model model, Principal principal) {
        // 선호 축제 목록 전달
        model.addAttribute("categories", List.of("꽃", "음악", "먹거리", "가족", "문화", "불꽃놀이"));
        return "preference-selection";
    }

    // 선호 축제 저장 처리
    @PostMapping("/save")
    public String savePreferences(@RequestParam("preferences") Set<String> preferences, Principal principal) {
        if (preferences.size() < 1 || preferences.size() > 3) {
            return "redirect:/preferences/select?error=true";
        }

        String userEmail = principal.getName();
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        user.setPreferences(preferences);
        userService.save(user);

        return "redirect:/home";
    }
}
