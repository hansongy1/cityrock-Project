import React, { useState, useRef, useEffect } from 'react';
import '../styles/ARCamera.css';
import cameraIcon from '../assets/cameraicon.png'; // 카메라 아이콘
import flashIcon from '../assets/flashicon.png'; // 플래시 아이콘
import galleryIcon from '../assets/galleryicon.png'; // 갤러리 아이콘
import timerIcon from '../assets/timericon.png'; // 타이머 아이콘
import gridIcon from '../assets/gridicon.png'; // 격자 아이콘
import haechi from '../assets/haechi.png'; // 해치 이미지
import bonggonge from '../assets/bonggonge.svg'; // 봉공이 이미지
import yongyonge from '../assets/yongyonge.svg'; // 용용이 이미지
import herotoro from '../assets/herotoro.webp'; // 해로토로 이미지
import parange from '../assets/parange.webp'; // 파랑이 이미지
import camerabutton from '../assets/camerabutton.png'; // 카메라 버튼

const ArCamera = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterPosition, setCharacterPosition] = useState({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 전면/후면 전환
  const [gridVisible, setGridVisible] = useState(false); // 격자 표시 여부
  const [flashEnabled, setFlashEnabled] = useState(false); // 플래시 활성화 여부
  const [timer, setTimer] = useState(0); // 타이머 설정
  const [timerCount, setTimerCount] = useState(null); // 타이머 카운트다운 상태
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드된 이미지 상태
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const characterRef = useRef(null);

  // 카메라 시작 함수
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }, // 전면/후면 카메라
          audio: false,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('카메라 시작 오류:', err);
        alert('카메라 접근이 거부되었거나 지원하지 않습니다.');
      }
    };

    startCamera();
  }, [facingMode]);

  // 캐릭터 선택 핸들러
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 드래그 시작 핸들러
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // 드래그 중 캐릭터 위치 변경
  const handleMouseMove = (e) => {
    if (isDragging) {
      setCharacterPosition({
        x: e.clientX - characterRef.current.clientWidth / 2,
        y: e.clientY - characterRef.current.clientHeight / 2,
      });
    }
  };

  // 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 사진 촬영 함수 (타이머 기능 포함)
  const handleTakePhoto = () => {
    const takePhotoWithDelay = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (uploadedImage) {
        // 업로드된 이미지를 캔버스에 그리기
        const uploadedImg = new Image();
        uploadedImg.src = uploadedImage;
        uploadedImg.onload = () => {
          context.drawImage(uploadedImg, 0, 0, canvas.width, canvas.height);
        };
      } else {
        // 비디오 화면을 캔버스에 그리기
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      if (selectedCharacter) {
        const img = new Image();
        img.src = selectedCharacter;
        img.onload = () => {
          context.drawImage(
            img,
            characterPosition.x,
            characterPosition.y,
            img.width / 2,
            img.height / 2
          );
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'photo_with_character.png';
          link.click();
        };
      } else {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'photo.png';
        link.click();
      }
    };

    if (timer > 0) {
      let count = timer;
      setTimerCount(count);
      const countdownInterval = setInterval(() => {
        count -= 1;
        setTimerCount(count);
        if (count === 0) {
          clearInterval(countdownInterval);
          setTimerCount(null);
          takePhotoWithDelay();
        }
      }, 1000);
    } else {
      takePhotoWithDelay();
    }
  };

  // 전면/후면 카메라 전환
  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  // 격자 표시 토글
  const toggleGrid = () => {
    setGridVisible(!gridVisible);
  };

  // 플래시 토글 (브라우저에서는 지원하지 않음)
  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    alert('플래시 기능은 브라우저에서 지원되지 않습니다.');
  };

  // 타이머 설정
  const setPhotoTimer = (seconds) => {
    setTimer(seconds);
  };

  return (
    <div
      className="ar-camera-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <header className="ar-camera-header">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="gallery-upload"
        />
        <label htmlFor="gallery-upload">
          <img src={galleryIcon} alt="Gallery" className="header-icon" />
        </label>
        <img src={cameraIcon} alt="Camera" className="header-icon" onClick={toggleCamera} />
        <img src={gridIcon} alt="Grid" className="header-icon" onClick={toggleGrid} />
        <img src={timerIcon} alt="Timer" className="header-icon" onClick={() => setPhotoTimer(3)} />
        <img src={flashIcon} alt="Flash" className="header-icon" onClick={toggleFlash} />
      </header>

      <div className="camera-preview">
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
            style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : { transform: 'none' }} // 좌우반전 제어
          />
        )}
        {gridVisible && <div className="grid-overlay"></div>}
        {timerCount !== null && (
          <div className="timer-overlay">
            <h1>{timerCount}</h1>
          </div>
        )}
        {selectedCharacter && (
          <img
            ref={characterRef}
            src={selectedCharacter}
            alt="Selected Character"
            className="selected-character"
            style={{
              top: `${characterPosition.y}px`,
              left: `${characterPosition.x}px`,
              position: 'absolute',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="character-selection">
        <img src={haechi} alt="Haechi" onClick={() => handleCharacterSelect(haechi)} />
        <img src={bonggonge} alt="Bonggonge" onClick={() => handleCharacterSelect(bonggonge)} />
        <img src={yongyonge} alt="Yongyonge" onClick={() => handleCharacterSelect(yongyonge)} />
        <img src={herotoro} alt="Herotoro" onClick={() => handleCharacterSelect(herotoro)} />
        <img src={parange} alt="Parange" onClick={() => handleCharacterSelect(parange)} />
      </div>

      <img src={camerabutton} onClick={handleTakePhoto} alt="camera-button" />
    </div>
  );
};

export default ArCamera;
