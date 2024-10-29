package com.capstone.project;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
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

    // 유저 저장 (비밀번호 암호화 포함)
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 이메일로 유저 찾기
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 사용자 이름으로 유저 찾기 (이메일과 혼동되는 경우가 있어 추가)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByEmail(username); // 이메일을 사용자 이름으로 사용하는 경우
    }

    // 비밀번호 검증
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // 이메일로 유저 삭제
    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    // 유저 ID로 유저 삭제 (리뷰, 스크랩 등 종속 관계 처리 포함)
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 스크랩 및 리뷰 연관 정보 삭제
        scrapService.unscrapAllReviewsByUser(user);

        // 탈퇴 유저의 리뷰를 스크랩한 다른 유저들의 스크랩 정보 삭제
        List<Review> userReviews = reviewService.findByUser(user);
        for (Review review : userReviews) {
            scrapService.unscrapAllByReview(review);
        }

        // 유저의 모든 리뷰 삭제
        reviewService.deleteAllByUser(user);

        // 유저 삭제
        userRepository.delete(user);

        // 로그 기록
        System.out.println("유저 삭제 완료: " + user.getEmail());
    }

    // 유저 저장 (직접 호출용)
    public User save(User user) {
        return userRepository.save(user);
    }

    // 사용자가 선호 키워드를 가지고 있는지 확인
    public boolean hasPreferences(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getPreferences() != null && !user.getPreferences().isEmpty())
                .orElse(false);
    }
}
