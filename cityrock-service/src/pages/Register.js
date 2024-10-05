// Register.js((src/pages/Register.js)회원가입)
import { useState, useRef } from 'react';
import Button from './Button';
import '../styles/Register.css';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

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

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword);
  // };

  return (

    <div className="register-form">
      {/* 회원가입 폼 UI */}
      <h2>회원가입</h2>
      <input placeholder="이름" ref={usernameRef} />
      <input placeholder="이메일" ref={emailRef} />
      <input placeholder="비밀번호" type="password" ref={passwordRef} />
      {/* <input placeholder="비밀번호 확인" type="password" ref={confirmPasswordRef} /> */}
      <input placeholder="휴대폰 번호" ref={phoneNumberRef} />
      <input type="date" placeholder="생년월일" ref={birthdateRef} />
      <Button btn="가입하기" click={handleRegister} />
      {errMsg && <div className="error-message">{errMsg}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}
    </div>
    // <div className="register-form">
    //   <h2>회원가입</h2>
    //   <div className="accounttxt">이름</div>
    //   <input placeholder="이름을 입력해주세요" ref={usernameRef} />
    //   <div className="accounttxt">이메일</div>
    //   <input placeholder="이메일을 입력해주세요" ref={emailRef} />
    //   <div className="accounttxt">비밀번호</div>
    //   <div className="input-container">
    //     <input
    //       type={showPassword ? 'text' : 'password'}
    //       placeholder="10-20자의 영문, 숫자, 특수문자 모두 조합"
    //       ref={passwordRef}
    //       className={`password-input ${passwordMatch ? 'match' : ''}`}
    //     />
    //     <div className="icon-container" onClick={togglePasswordVisibility}>
    //       {showPassword ? <IoMdEyeOff className="icon" /> : <IoMdEye className="icon" />}
    //     </div>
    //   </div>
    //   <div className="input-container">
    //     <input
    //       type={showConfirmPassword ? 'text' : 'password'}
    //       placeholder="비밀번호 확인"
    //       ref={confirmPasswordRef}
    //       className={`password-input ${passwordMatch ? 'matchcheck' : ''}`}
    //     />
    //     <div className="icon-container" onClick={toggleConfirmPasswordVisibility}>
    //       {showConfirmPassword ? <IoMdEyeOff className="icon" /> : <IoMdEye className="icon" />}
    //     </div>
    //   </div>
    //   {passwordMatch && <div className="success-message1">비밀번호가 일치합니다</div>}
    //   <div className="accounttxt">휴대폰 번호</div>
    //   <input type="phonenumber" placeholder="본인 인증이 필요합니다" ref={phonenumberRef} />
    //   <Button className="register-button" btn="가입하기" click={handleRegister} />
    //   {errMsg && <div className="error-message">{errMsg}</div>}
    //   {successMsg && <div className="success-message">{successMsg}</div>}
    //   <div className="loginq">
    //     이미 계정이 있습니까? <span>로그인하기</span>
    //   </div>
    // </div>
  );
}

export default Register;
