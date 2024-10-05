import React from 'react';
import { useNavigate } from 'react-router-dom';
import cityLogo from '../assets/city-logo.png';
import AIIMM from '../assets/AIprofilemain.png';
import '../styles/AIprofile.css';

const AIprofile = () => {

  const navigate = useNavigate();

  const handlehomeClick = () => {
    navigate('/')
  }

  const handleContinueClick = () => {
    navigate('/AIprofileStep1'); // 버튼 클릭 시 '/AIprogileStep1'로 이동
  };

  return (
    <div className="ai-profile-container">
      <header className="header">
                <img onClick={handlehomeClick} className='logo' src={cityLogo} alt='Logo' />
      </header>
      <div onClick={handleContinueClick} className="profile-card">
          <img className="aipim" src={AIIMM} alt='aipim' />
          <div className="profile-description">
          <h2 className='aipst1'>AI 프로필</h2>
          <p className='aipst'>
            30개 테마로 만나는 당신을 위한 특별한 프로필 <br />
            AI를 통해 “나”를 표현해 보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIprofile;
