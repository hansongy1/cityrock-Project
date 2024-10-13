package com.capstone.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // 축제별 리뷰 목록 가져오기
    public List<Review> getReviewsByFestival(Long festivalId) {
        return reviewRepository.findByFestivalId(festivalId);
    }
    
    // 축제에 해당하는 리뷰 리스트 가져오기
    public List<Review> findByFestival(Festival festival) {
        return reviewRepository.findByFestival(festival);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }
    
    // ReviewService의 findById 메서드
    public Optional<Review> findById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }
    
    // 유저가 작성한 모든 리뷰 가져오기
    public List<Review> findByUser(User user) {
        return reviewRepository.findByUser(user);
    }

    // 유저가 작성한 모든 리뷰 삭제
    public void deleteAllByUser(User user) {
        List<Review> reviews = reviewRepository.findByUser(user);
        reviewRepository.deleteAll(reviews); // 리뷰 삭제
    }

}

