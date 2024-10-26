import React from 'react';
import AIIM from '../assets/AIprofileimg.png';
import AIIM2 from '../assets/AIprofileimg2.png';
import AIIM3 from '../assets/AIprofileimg3.jpg';
import AIIM4 from '../assets/AIprofileimg4.jpg';
import { useNavigate } from 'react-router-dom';
import '../styles/AIprofileStep1.css';


const AIprofileStep1 = () => {
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate('/AIprofileStep2'); // 버튼 클릭 시 '/AIprogileStep2'로 이동
  };

  const handleBackClick = () => {
    navigate(-1); // 버튼 클릭 시 전 페이지로 이동
  };

  return (
    <div className="before-start-container">
      <div className='header'>
      <p onClick={handleBackClick} className='back'> &lt; </p>
      <p className='step'>1/3 Step</p>
      </div>
      <h2 className='Before-start'>시작하기 전</h2>
      <div className='subt'>무한한 프로필을 만나볼 수 있어요.</div>
      <p className='subt2'>도시락의 AI는 최적의 결과물을 위해 계속 학습하고 있습니다.</p>
      <div className="grid-container">
        <img className="aiim" src={AIIM} alt='aipim' />
        <img className="aiim" src={AIIM2} alt='aipim2' />
        </div>
        <div className="grid-container">
        <img className="aiim" src={AIIM3} alt='aipim3' />
        <img className="aiim" src={AIIM4} alt='aipim4' />
        </div>
      <button onClick={handleContinueClick} className="continue-button">계속하기</button>
    </div>
  );
};

export default AIprofileStep1;
