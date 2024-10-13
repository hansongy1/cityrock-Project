package com.capstone.project;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ScrapRepository extends JpaRepository<Scrap, Long> {
    boolean existsByUserAndReview(User user, Review review);
    void deleteByUserAndReview(User user, Review review);
    Optional<Scrap> findByUserAndReview(User user, Review review);
    List<Scrap> findByUser(User user); // 유저가 스크랩한 모든 리뷰 찾기
    List<Scrap> findByReview(Review review); // 특정 리뷰를 스크랩한 모든 레코드 찾기
}
