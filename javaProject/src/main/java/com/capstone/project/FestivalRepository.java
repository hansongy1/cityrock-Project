package com.capstone.project;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    List<Festival> findByCategory(String category);

    // 카테고리 목록으로 축제 검색 (ver.15)
    List<Festival> findByCategoryIn(Set<String> categories);
}
