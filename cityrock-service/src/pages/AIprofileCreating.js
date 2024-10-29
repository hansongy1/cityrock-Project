import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [activeDot, setActiveDot] = useState(0);
  const location = useLocation();
  const fileName = location.state?.fileName || ''; // 전달받은 파일 이름이 있는지 확인
  console.log("AIprofileCreating에서 전달받은 파일 이름:", fileName);



  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };


  
  const downloadImage = () => {
    if (!fileName) {
      alert('다운로드할 파일 이름이 없습니다. 파일 생성이 완료되었는지 확인하세요.');
      return;
    }

    const downloadUrl = `http://localhost:8080/profile/downloadImage?fileName=${encodeURIComponent(fileName)}`;

    fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('파일을 다운로드할 수 없습니다.');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('다운로드 오류:', error);
        alert('파일을 다운로드하는 중 문제가 발생했습니다.');
      });
  };

  return (
    <div className="profile-creating-container">
      <header className="header">
        <img
          onClick={handleHomeClick}
          className="logo"
          src={cityLogo}
          alt="도시락 로고"
        />
      </header>

      <div className="profile-status">
        <div className="profile-ing">
          <h2 className="profile-text">프로필 생성 중</h2>
          <div className="dots-container">
            <span className={`dot ${activeDot >= 1 ? 'active red' : ''}`}>·</span>
            <span className={`dot ${activeDot >= 2 ? 'active yellow' : ''}`}>·</span>
            <span className={`dot ${activeDot >= 3 ? 'active blue' : ''}`}>·</span>
          </div>
        </div>
        <p className="imging">
          잠시만 기다려 주세요!
          <br />
          지금 프로필 이미지를 생성 중입니다.
        </p>

        {/* 캐러셀 */}
        <div className="profile-placeholder">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            stopOnHover={false}
            swipeable={true}
            centerMode={true}
            centerSlidePercentage={70}
            showArrows={false}
            showIndicators={false}
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

        <p className="time-notice">곧 프로필 이미지가 공개됩니다!</p>
        <button onClick={downloadImage} className="hide-button">
          다운로드 하기
        </button>
      </div>
    </div>
  );
};

export default AIProfileCreating;
