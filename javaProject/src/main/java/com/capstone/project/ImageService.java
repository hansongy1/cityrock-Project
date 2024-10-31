package com.capstone.project;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FileUtils;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import javax.imageio.ImageIO;

@Service
public class ImageService {

    private static final String UPLOAD_DIR = "C:/uploaded-images/";
    private static final String PROCESSED_DIR = "C:/processed-images/";
    private static final String HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4";
    private static final String HUGGING_FACE_API_KEY = "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"; // Stable Diffusion API 키
    private static final String REMOVE_BG_API_KEY = "F6hfDTnqb8x4sHkjAsRj11LL";  // remove.bg API 키
    private static final int MAX_FILES = 30; // 최대 파일 개수

    // 키워드와 랜덤 프롬프트를 매핑한 Map
    private static final Map<String, String[]> promptsMap = new HashMap<>();

    static {
        promptsMap.put("불꽃놀이", new String[]{
            "A vibrant fireworks festival with colorful explosions in the night sky",
            "Fireworks lighting up a crowded city skyline with festive lights",
            "A serene lake reflecting bright fireworks and a cheering crowd"
        });
        promptsMap.put("바다", new String[]{
            "A sunny beach with white sand and blue water",
            "A peaceful beach with palm trees and gentle waves",
            "A lively beach with sunbathers, colorful umbrellas, and children playing"
        });
        promptsMap.put("산", new String[]{
            "Snow-covered mountains under a bright blue sky",
            "A misty mountain range with lush green forests",
            "A serene autumn landscape with mountains and colorful foliage"
        });
        promptsMap.put("겨울", new String[]{
            "A snowy village with twinkling lights and falling snowflakes",
            "A vast snowy landscape with frosted trees and a clear sky",
            "A cozy cabin surrounded by deep snow and pine trees"
        });
        promptsMap.put("가을", new String[]{
            "A picturesque forest with trees in red and orange autumn leaves",
            "A quiet autumn park with fallen leaves covering the ground",
            "A winding mountain road lined with vibrant autumn foliage"
        });
        promptsMap.put("등불축제", new String[]{
            "A magical lantern festival with floating lanterns illuminating the night",
            "A traditional village glowing with colorful lanterns",
            "A bustling lantern festival with people gathering to celebrate"
        });
        promptsMap.put("뮤직페스티벌", new String[]{
            "A lively outdoor music festival with a large crowd and bright stage lights",
            "A sunset music festival with people dancing under the stars",
            "A vibrant music event with a famous DJ and cheering fans"
        });
        promptsMap.put("장미 축제", new String[]{
            "A beautiful rose garden in full bloom with vibrant colors",
            "A sunset scene with fields of roses in the foreground",
            "Roses growing along a stone pathway in a garden"
        });
        promptsMap.put("크리스마스", new String[]{
            "A snowy Christmas village with decorated trees and holiday lights",
            "A cozy town square with a large Christmas tree and falling snow",
            "A festive Christmas market with people shopping and sipping hot cocoa"
        });
        promptsMap.put("default", new String[]{
            "A beautiful festival background with soft lights and a cheerful ambiance",
            "A vibrant celebration scene with people enjoying a lively festival",
            "A colorful event with various decorations and happy crowds"
        });
    }

    // 파일 저장 메서드
    public String saveUploadedFile(MultipartFile file) throws IOException {
        deleteOldFilesIfNecessary(UPLOAD_DIR);
        deleteOldFilesIfNecessary(PROCESSED_DIR);

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File dest = new File(UPLOAD_DIR + fileName);
        FileUtils.writeByteArrayToFile(dest, file.getBytes());
        return fileName;
    }

    // 이미지 처리 메서드
    public String processImage(String fileName, String keyword) throws IOException {
        // 1. 인물 이미지에서 배경 제거
        String foregroundFileName = removeBackground(fileName);
        // 2. 키워드 기반으로 배경 이미지 생성
        String backgroundFileName = generateBackgroundWithAI(keyword);
        // 3. 배경 이미지와 인물 이미지 합성
        return mergeImages(foregroundFileName, backgroundFileName);
    }

    // 배경 제거 메서드
    private String removeBackground(String fileName) throws IOException {
        File inputFile = new File(UPLOAD_DIR + fileName);
        File outputFile = new File(UPLOAD_DIR + "no-bg-" + fileName);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost("https://api.remove.bg/v1.0/removebg");
            httpPost.setHeader("X-Api-Key", REMOVE_BG_API_KEY);

            HttpEntity reqEntity = MultipartEntityBuilder.create()
                    .addBinaryBody("image_file", inputFile, ContentType.create("image/png"), inputFile.getName())
                    .addTextBody("size", "auto")
                    .build();
            httpPost.setEntity(reqEntity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                if (response.getStatusLine().getStatusCode() == 200) {
                    InputStream is = response.getEntity().getContent();
                    FileUtils.copyInputStreamToFile(is, outputFile);
                    return outputFile.getName();
                } else {
                    throw new IOException("배경 제거 실패: " + response.getStatusLine().getStatusCode());
                }
            }
        }
    }

    // Stable Diffusion API를 통해 배경 이미지 생성
    private String generateBackgroundWithAI(String keyword) throws IOException {
        String prompt = getPromptForKeyword(keyword);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(HUGGING_FACE_API_URL);
            httpPost.setHeader("Authorization", "Bearer " + HUGGING_FACE_API_KEY);
            httpPost.setHeader("Content-Type", "application/json");

            JSONObject jsonRequest = new JSONObject();
            jsonRequest.put("inputs", prompt);
            StringEntity entity = new StringEntity(jsonRequest.toString());
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                if (response.getStatusLine().getStatusCode() == 200) {
                    try (InputStream inputStream = response.getEntity().getContent()) {
                        String resultFileName = "bg-" + UUID.randomUUID().toString() + ".png";
                        File outputFile = new File(PROCESSED_DIR + resultFileName);
                        FileUtils.copyInputStreamToFile(inputStream, outputFile);
                        return resultFileName;
                    }
                } else {
                    String errorMessage = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                    throw new IOException("Stable Diffusion API 요청 실패. 응답 코드: " + response.getStatusLine().getStatusCode() + ", 내용: " + errorMessage);
                }
            }
        }
    }

    // 키워드 기반 랜덤 프롬프트 생성
    private String getPromptForKeyword(String keyword) {
        String[] prompts = promptsMap.getOrDefault(keyword, promptsMap.get("default"));
        Random random = new Random();
        return prompts[random.nextInt(prompts.length)];
    }

    // 배경 이미지와 인물 이미지 합성
    private String mergeImages(String foregroundFileName, String backgroundFileName) throws IOException {
        BufferedImage foreground = ImageIO.read(new File(UPLOAD_DIR + foregroundFileName));
        BufferedImage background = ImageIO.read(new File(PROCESSED_DIR + backgroundFileName));

        Image resizedBackground = background.getScaledInstance(foreground.getWidth(), foreground.getHeight(), Image.SCALE_SMOOTH);
        BufferedImage combined = new BufferedImage(foreground.getWidth(), foreground.getHeight(), BufferedImage.TYPE_INT_ARGB);

        Graphics g = combined.getGraphics();
        g.drawImage(resizedBackground, 0, 0, null);
        g.drawImage(foreground, 0, 0, null);

        String resultFileName = "final-" + UUID.randomUUID().toString() + ".png";
        ImageIO.write(combined, "PNG", new File(PROCESSED_DIR + resultFileName));

        return resultFileName;
    }

    // 오래된 파일 삭제 메서드
    private void deleteOldFilesIfNecessary(String directoryPath) throws IOException {
        File directory = new File(directoryPath);
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".jpg") || name.endsWith(".png"));

        if (files != null && files.length > MAX_FILES) {
            Arrays.sort(files, Comparator.comparingLong(File::lastModified));
            int filesToDelete = files.length - MAX_FILES;
            for (int i = 0; i < filesToDelete; i++) {
                Files.deleteIfExists(files[i].toPath());
                System.out.println("오래된 파일 삭제: " + files[i].getName());
            }
        }
    }
}
