// Register.js((src/pages/Register.js)회원가입)
import { useState, useRef } from 'react';
import Button from './Button';
import '../styles/Register.css';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  // const confirmPasswordRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const birthdateRef = useRef(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  // 회원가입 요청 처리 함수
  const handleRegister = async () => {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // const confirmPassword = confirmPasswordRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const birthdate = birthdateRef.current.value;  // 생년월일 추가

    if (!username || !email || !password || !phoneNumber || !birthdate) {
      setErrMsg('모든 입력창을 채워주세요');
      return;
    }

    // 비밀번호 확인(java 없음)
    // if (password !== confirmPassword) {
    //   setErrMsg('비밀번호가 일치하지 않습니다');
    //   setPasswordMatch(false);
    //   return;
    // } else {
    //   setPasswordMatch(true);
    //   setSuccessMsg('비밀번호가 일치합니다');
    // }

    // 서버로 회원가입 요청을 보냅니다.
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, phoneNumber, birthdate }),
      });
      
      // const data = await response.json();
      if (response.ok) {
        const data = await response.json();
        console.log("회원가입 성공:", data);
        setSuccessMsg(data.message);
        navigate('/login'); // 버튼 클릭 시 '/login'로 이동
      } else {
        const errorData = await response.json();
        console.error("회원가입 실패:", errorData.message);
        setErrMsg('회원가입에 실패했습니다: ' + errorData.message);
      }
    
    } catch (error) {
        console.error("서버 오류:", error);
        setErrMsg('서버 오류가 발생했습니다.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // const checkPasswordMatch = () => {
  //   const passwordValue = passwordRef.current.value;
  //   const confirmPasswordValue = confirmPasswordRef.current.value;
  //   if (passwordValue === confirmPasswordValue) {
  //     setPasswordMatch(true);
  //     setSuccessMsg('비밀번호가 같습니다!');
  //   } else {
  //     setPasswordMatch(false);
  //     setErrMsg('비밀번호가 일치하지 않습니다');
  //   }
  // };
  
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login'); // 버튼 클릭 시 '/login'로 이동
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword);
  // };

  return (
    // (!username || !email || !password || !phoneNumber || !birthdate)
    <div className="register-form">
      <h2>회원가입</h2>
      <div className="accounttxt">이름</div>
      <input placeholder="이름을 입력해주세요" ref={usernameRef} />
      <div className="accounttxt">이메일</div>
      <input placeholder="이메일을 입력해주세요" ref={emailRef} />
      <div className="accounttxt">비밀번호</div>
      <div className="input-container">
        <input placeholder="10-20자의 영문, 숫자, 특수문자 모두 조합" type="password" ref={passwordRef} />
        {/* <input placeholder="10-20자의 영문, 숫자, 특수문자 모두 조합" type={showPassword ? "text" : "password"} ref={passwordRef} /> */}
          <div className="icon-container" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <IoMdEyeOff className="icon" />
            ) : (
              <IoMdEye className="icon" />
            )}
          </div>
      </div>
      {/* <input placeholder="비밀번호 확인" type="password" ref={confirmPasswordRef} /> */}
      <div className="accounttxt">휴대폰 번호</div>
      <input placeholder="010-0000-0000" ref={phoneNumberRef} />
      <div className="accounttxt">생년월일</div>
      <input type="date" placeholder="생년월일" ref={birthdateRef} />
      {errMsg && <div className="error-message">{errMsg}</div>}
      <Button className="register-button" btn="가입하기" click={handleRegister} />
      <div onClick={handleLoginClick} className="loginq">
        이미 계정이 있습니까? <span>로그인하기</span>{' '}
      </div>
      {successMsg && <div className="success-message">{successMsg}</div>}
    </div>
  );
}

export default Register;
