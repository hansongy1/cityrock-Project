package com.capstone.project;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // 에러 페이지를 별도로 처리하거나 로그를 출력
        return "redirect:/initialUser"; // 필요시 수정 가능
    }
}