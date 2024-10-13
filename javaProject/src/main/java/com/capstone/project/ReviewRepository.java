package com.capstone.project;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFestivalId(Long festivalId);
    List<Review> findByFestival(Festival festival);
    List<Review> findByUser(User user); // 유저가 작성한 리뷰 찾기
}
