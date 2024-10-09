// Login.js

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';  // 리다이렉트용 훅
import '../styles/Login.css';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();  // 리다이렉트용 훅 선언

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // showPassword 상태를 반전시킴
    };
    
    const handleRegisterClick = () => {
    navigate('/register'); // 버튼 클릭 시 '/register'로 이동
};

    

    // 로그인 요청 처리 함수
    const loginUser = async (e) => {
        e.preventDefault();  // 페이지 새로고침 방지

        const credentials = { email, password };  // 사용자 입력 값

        try {
            // 백엔드로 로그인 API 요청
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),  // JSON 형식으로 데이터 전송
            });

            const data = await response.json();
            console.log(data);  // 로그인 결과 확인
            if (response.ok) {
                alert("로그인 성공!");  // 성공 시 알림
                // 로그인 성공 시 AfterHome.js(src/components/AfterHome.js)로 리다이렉트
                navigate('/AfterHome');  // 로그인 성공 시 /home-login 경로로 리다이렉트
            } else {
                alert("로그인 실패: " + data.message);  // 실패 시 알림
            }
        } catch (error) {
            console.error('Error:', error);
            alert("서버 오류로 인해 로그인을 할 수 없습니다.");
        }
    };

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <form onSubmit={loginUser}>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // 이메일 입력 처리
                />
                <div className="password-box">
                    <input
                        // type="password"
                        type={showPassword ? "text" : "password"}  // showPassword에 따라 input type이 변경됨
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // 비밀번호 입력 처리
                    />
                    {/* {showPassword ? (
                        <IoMdEyeOff onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                        <IoMdEye onClick={() => setShowPassword(!showPassword)} />
                    )} */}
                    {showPassword ? (
                        <IoMdEyeOff onClick={togglePasswordVisibility} />  // 눈 가린 아이콘 클릭 시 비밀번호 숨김
                    ) : (
                        <IoMdEye onClick={togglePasswordVisibility} />  // 눈 아이콘 클릭 시 비밀번호 표시
                    )}
                </div>
                <div onClick={handleRegisterClick} className="registergo">계정이 없다면? | 회원가입 하기</div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default Login;