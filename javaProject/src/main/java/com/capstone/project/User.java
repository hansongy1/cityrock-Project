package com.capstone.project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
// import jakarta.persistence.*;
// import java.time.LocalDate;

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
    // private LocalDate birthdate;  // 사용자 생년월일
    private String birthdate;  // 사용자 생년월일

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

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }
}
