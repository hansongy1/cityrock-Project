package com.capstone.project;

import java.io.File;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ScrapService scrapService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //ver.18 디렉토리 경로 추가
    private static final String PROFILE_IMAGE_DIR = "C:/profile/";
    private static final String REVIEW_IMAGE_DIR = "C:/uploads/";
    
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));  // 비밀번호 암호화
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }
    
    // 유저 탈퇴 처리 (ver.18 수정)
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

        // 3. 탈퇴 유저의 리뷰 이미지 삭제
        for (Review review : userReviews) {
            deleteFile(REVIEW_IMAGE_DIR, review.getImage());
        }

        // 4. 탈퇴 유저의 모든 리뷰 삭제
        reviewService.deleteAllByUser(user);

        // 5. 유저의 프로필 이미지 삭제
        deleteFile(PROFILE_IMAGE_DIR, user.getProfileImage());

        // 6. 유저 삭제
        userRepository.delete(user);

        // 7. 로그 확인
        System.out.println("유저 삭제 완료: " + user.getEmail());
    }
    
    // 파일 삭제를 위한 메서드 (ver.18 추가)
    private void deleteFile(String directory, String fileName) {
        if (fileName != null && !fileName.isEmpty()) {
            File file = new File(directory + fileName);
            if (file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    System.err.println("파일 삭제 실패: " + file.getAbsolutePath());
                } else {
                    System.out.println("파일 삭제 성공: " + file.getAbsolutePath());
                }
            } else {
                System.out.println("파일이 존재하지 않습니다: " + file.getAbsolutePath());
            }
        }
    }
    
    //ver.13 추가
    public User save(User user) {
        return userRepository.save(user);
    }

    public boolean hasPreferences(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getPreferences() != null && !user.getPreferences().isEmpty())
                .orElse(false);
    }
    
    //ver.15
    public void addRecentFestival(User user, Festival festival) {
        List<Festival> recentFestivals = user.getRecentFestivals();

        // 이미 리스트에 있는 경우 제거 (중복 방지)
        recentFestivals.remove(festival);

        // 리스트의 맨 앞에 추가
        recentFestivals.add(0, festival);

        // 리스트 크기가 10을 초과하면 마지막 요소 제거
        if (recentFestivals.size() > 10) {
            recentFestivals.remove(10);
        }

        // 변경 사항 저장
        userRepository.save(user);
    }
}
