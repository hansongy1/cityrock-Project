package com.capstone.project;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class KeywordController {

    private final ImageService imageService;

    public KeywordController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/keywords")
    public ResponseEntity<?> processKeywords(@RequestBody Map<String, Object> request) {
        try {
            // 키워드 및 파일 이름 처리
            List<String> keywords = (List<String>) request.get("keywords");
            String fileName = (String) request.get("fileName");
    
            // 실제 파일이 업로드된 후의 파일 이름을 응답으로 보냅니다.
            if (keywords == null || keywords.isEmpty() || fileName == null || fileName.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"message\": \"키워드 또는 파일 이름이 비어 있습니다.\"}");
            }
            String resultFileName = imageService.processImage(fileName, keywords.get(0));
            return ResponseEntity.ok().body("{\"fileName\": \"" + resultFileName + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"이미지 처리 실패\"}");
        }
    }
    
}
