package com.capstone.project;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.*;

@Controller
@RequestMapping("/profile")
public class DownloadController {

    private static final String PROCESSED_DIR = "C:/processed-images/";

		@GetMapping("/downloadImage")
		public ResponseEntity<Resource> downloadImage(@RequestParam("fileName") String fileName) {
			 try {
					Path filePath = Paths.get("C:/processed-images/" + fileName).normalize();
					System.out.println("다운로드 경로: " + filePath.toString());
					Resource resource = new UrlResource(filePath.toUri());
					if (resource.exists() && resource.isReadable()) {
						 return ResponseEntity.ok()
									 .contentType(MediaType.parseMediaType("application/octet-stream"))
									 .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
									 .body(resource);
					} else {
						 System.out.println("파일을 찾을 수 없거나 읽을 수 없습니다: " + filePath.toString());
						 return ResponseEntity.notFound().build();
					}
			 } catch (MalformedURLException e) {
					e.printStackTrace();
					return ResponseEntity.internalServerError().build();
			 
				}
		}
		
}
