package com.capstone.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    List<Festival> findByCategory(String category);
}
