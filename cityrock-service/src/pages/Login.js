// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegisterClick = () => {
        navigate('/register'); // 버튼 클릭 시 '/register'로 이동
    };

    // 로그인 요청 처리 함수
    const loginUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("username", data.username);
                alert("로그인 성공!");

                // 응답의 hasPreferences 값에 따라 페이지 리다이렉트
                if (data.hasPreferences === "false") {
                    navigate('/initialUser'); // 선호도 선택 페이지로 이동
                } else {
                    navigate('/loginmypage');  // MyPage로 이동
                }
            } else {
                alert("로그인 실패: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
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
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword ? (
                        <IoMdEyeOff onClick={togglePasswordVisibility} />
                    ) : (
                        <IoMdEye onClick={togglePasswordVisibility} />
                    )}
                </div>
                <div onClick={handleRegisterClick} className="registergo">계정이 없다면? | 회원가입 하기</div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default Login;
