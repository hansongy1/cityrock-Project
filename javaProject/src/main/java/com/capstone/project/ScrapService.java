package com.capstone.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ScrapService {

    @Autowired
    private ScrapRepository scrapRepository;

    // 스크랩 추가 로직
    @Transactional
    public void scrapReview(User user, Review review) {
        Scrap scrap = new Scrap();
        scrap.setUser(user);
        scrap.setReview(review);
        scrapRepository.save(scrap); // 스크랩 저장
    }

    @Transactional
    public void unsnapReview(User user, Review review) {
        Scrap scrap = scrapRepository.findByUserAndReview(user, review)
                .orElseThrow(() -> new IllegalArgumentException("Scrap not found"));
        scrapRepository.delete(scrap); // 스크랩 삭제
    }

    public boolean isScrapped(User user, Review review) {
        return scrapRepository.findByUserAndReview(user, review).isPresent();
    }
    
    public void unscrapReview(User user, Review review) {
        Scrap scrap = scrapRepository.findByUserAndReview(user, review)
                .orElseThrow(() -> new IllegalArgumentException("Scrap not found"));
        scrapRepository.delete(scrap);
    }
    
    // 유저가 스크랩한 모든 리뷰 스크랩 취소
    public void unscrapAllReviewsByUser(User user) {
        List<Scrap> scraps = scrapRepository.findByUser(user);
        for (Scrap scrap : scraps) {
            scrapRepository.delete(scrap); // 스크랩 취소
        }
    }

    // 특정 리뷰에 대한 모든 스크랩 취소
    public void unscrapAllByReview(Review review) {
        List<Scrap> scraps = scrapRepository.findByReview(review);
        for (Scrap scrap : scraps) {
            scrapRepository.delete(scrap); // 스크랩 취소
        }
    }

}
