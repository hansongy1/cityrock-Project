package com.capstone.project;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ScrapService scrapService;

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));  // 비밀번호 암호화
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 비밀번호 암호화
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    // 유저 탈퇴 처리
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 1. 유저가 스크랩한 모든 리뷰 스크랩 취소
        scrapService.unscrapAllReviewsByUser(user);

        // 2. 다른 유저가 스크랩한 탈퇴 유저의 리뷰에 대한 스크랩 취소
        List<Review> userReviews = reviewService.findByUser(user);
        for (Review review : userReviews) {
            scrapService.unscrapAllByReview(review); // 해당 리뷰를 스크랩한 모든 유저의 스크랩을 취소
        }

        // 3. 탈퇴 유저의 모든 리뷰 삭제
        reviewService.deleteAllByUser(user);

        // 4. 유저 삭제
        userRepository.delete(user);
    }
}
