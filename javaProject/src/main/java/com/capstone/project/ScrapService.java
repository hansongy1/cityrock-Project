package com.capstone.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
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

    // 특정 리뷰가 스크랩되었는지 확인
    public boolean isScrapped(User user, Review review) {
        return scrapRepository.findByUserAndReview(user, review).isPresent();
    }
    
    // 유저가 스크랩한 모든 리뷰 스크랩 취소
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

    // 마이페이지 : 스크랩한 게시물 보기 기능
    public List<Review> getScrappedReviewsByUser(User user) {
        List<Scrap> scraps = scrapRepository.findByUser(user);
        return scraps.stream()
                .map(Scrap::getReview)
                .collect(Collectors.toList());
    }

    // 스크랩을 모두 가져오는 메서드
    public List<Scrap> findByUser(User user) {
        return scrapRepository.findByUser(user);
    }

}
