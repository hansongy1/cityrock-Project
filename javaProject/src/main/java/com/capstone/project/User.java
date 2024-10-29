package com.capstone.project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동으로 ID 부여
    private Long id;

    @Column(nullable = false)
    private String username;  // 사용자 이름

    @Column(nullable = false, unique = true)
    private String email;  // 사용자 이메일 (로그인에 사용)

    @Column(nullable = false)
    private String password;  // 사용자 비밀번호

    @Column(nullable = false)
    private String phoneNumber;  // 사용자 전화번호

    @Column(nullable = false)
    private LocalDate birthdate;  // 사용자 생년월일
    
    @Column(name = "profile_image", nullable = true)
    private String profileImage;  // 프로필 이미지
    
    //ver.13
    @ElementCollection(fetch = FetchType.EAGER) // 즉시 로딩으로 변경
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private Set<String> preferences = new HashSet<>();
    
    // 최근 본 축제 목록 (최대 10개) (Ver.15)
    @ManyToMany
    @JoinTable(
        name = "user_recent_festivals",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "festival_id")
    )
    private List<Festival> recentFestivals = new ArrayList<>();
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

	public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    //ver.13
    public Set<String> getPreferences() {
		return preferences;
	}

	public void setPreferences(Set<String> preferences) {
		this.preferences = preferences;
	}

	//ver.15
	public List<Festival> getRecentFestivals() {
		return recentFestivals;
	}

	public void setRecentFestivals(List<Festival> recentFestivals) {
		this.recentFestivals = recentFestivals;
	}

	//ver.16
	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
    
    
}
