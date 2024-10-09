import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // 기본 스타일
import '../styles/AIprofileCreating.css';
import cityLogo from '../assets/city-logo.png';
import aipc1 from '../assets/aiprofilecreate.png';
import aipc2 from '../assets/aiprofilecreate2.png';
import aipc3 from '../assets/aiprofilecreate3.png';
import aipc4 from '../assets/aiprofilecreate4.png';

const AIProfileCreating = () => {

  const navigate = useNavigate();

  const handlehomeClick = () => {
    navigate('/');
  };

  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleHideClick = () => {
    console.log('화면 숨기기 버튼이 클릭되었습니다.');
  };

  return (
    <div className="profile-creating-container">
      <header className="header">
        <img
          onClick={handlehomeClick}
          className="logo"
          src={cityLogo}
          alt="도시락 로고"
        />
      </header>

      <div className="profile-status">
        <div className="profile-ing">
          <h2 className="profile-text">프로필 생성 중</h2>
          <div className="dots-container">
            <span className={`dot ${activeDot >= 1 ? 'active red' : ''}`}>
              ·
            </span>
            <span className={`dot ${activeDot >= 2 ? 'active yellow' : ''}`}>
              ·
            </span>
            <span className={`dot ${activeDot >= 3 ? 'active blue' : ''}`}>
              ·
            </span>
          </div>
        </div>
        <p className="imging">
          지금 프로필 이미지를 생성 중입니다.
          <br /> 알림을 켜두시면, 도시락이 완료 알림을 보내드려요!
        </p>

        {/* 캐러셀 */}
        <div className="profile-placeholder">
          <Carousel
            showThumbs={false} // 썸네일 숨기기
            showStatus={false} // 상태 숨기기
            infiniteLoop={true} // 무한 루프
            autoPlay={true} // 자동 재생
            interval={3000} // 4초마다 이미지 넘기기
            stopOnHover={false} // 마우스 호버 시 일시정지하지 않음
            swipeable={true} // 스와이프 가능
            centerMode={true} // 중앙에 이미지 배치
            centerSlidePercentage={70} // 중앙 슬라이드의 크기 조정
            showArrows={false} // 화살표 숨기기
            showIndicators={false} // 이미지 순서 숨기기
          >
            <div>
              <img src={aipc1} alt="프로필 생성 이미지 1" className="carousel-image" />
            </div>
            <div>
              <img src={aipc2} alt="프로필 생성 이미지 2" className="carousel-image" />
            </div>
            <div>
              <img src={aipc3} alt="프로필 생성 이미지 3" className="carousel-image" />
            </div>
            <div>
              <img src={aipc4} alt="프로필 생성 이미지 4" className="carousel-image" />
            </div>
          </Carousel>
        </div>

        <p className="time-notice">23시간 후 프로필 이미지가 공개됩니다!</p>
        <button onClick={handleHideClick} className="hide-button">
          화면 숨기기
        </button>
      </div>
    </div>
  );
};

export default AIProfileCreating;
