package com.capstone.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    // 축제 저장
    public Festival save(Festival festival) {
        return festivalRepository.save(festival); // Festival을 DB에 저장
    }

    // 축제 리스트 가져오기
    public List<Festival> getAllFestivals() {
        return festivalRepository.findAll(); // 모든 축제 정보를 가져옴
    }

    // 카테고리별 축제 가져오기
    public List<Festival> getFestivalsByCategory(String category) {
        return festivalRepository.findByCategory(category); // 카테고리별 축제 목록 가져옴
    }

    // 축제 세부 정보 가져오기
    public Festival getFestivalById(Long id) {
        return festivalRepository.findById(id).orElse(null); // 축제 ID로 축제 세부 정보 가져옴
    }
}

