package com.capstone.project;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 도메인 허용
public class UploadController {

   private final ImageService imageService;

   public UploadController(ImageService imageService) {
       this.imageService = imageService;
   }

   @PostMapping("/upload")
   public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile file) {
       try {
           String fileName = imageService.saveUploadedFile(file);
           return ResponseEntity.ok().body("{\"fileName\": \"" + fileName + "\"}"); // JSON 형식으로 응답
       } catch (IOException e) {
           e.printStackTrace();
           return ResponseEntity.status(500).body("{\"message\": \"파일 업로드 실패\"}");
       }
   }
}
