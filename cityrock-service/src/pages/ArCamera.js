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
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [characterSize, setCharacterSize] = useState(100); // 캐릭터 크기 상태
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

    if (!uploadedImage) {
      startCamera(); // 업로드된 이미지가 없을 때만 카메라 시작
    }
  }, [facingMode, uploadedImage]);

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
        setUploadedImage(e.target.result); // 업로드된 이미지를 설정
      };
      reader.readAsDataURL(file);
    }
  };

  // 드래그 시작 핸들러
  const handleMouseDown = (e) => {
    if (selectedCharacter) {
      setIsDragging(true);
      // 마우스와 캐릭터 위치 간의 차이를 저장
      setDragOffset({
        x: e.clientX - characterPosition.x,
        y: e.clientY - characterPosition.y,
      });
    }
  };

  // 드래그 중 캐릭터 위치 변경
  const handleMouseMove = (e) => {
    if (isDragging) {
      setCharacterPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  // 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 캐릭터 크기 조절 핸들러
  const handleWheel = (e) => {
    if (selectedCharacter) {
      const newSize = characterSize + e.deltaY * -0.05; // 크기 조절 속도 조절
      if (newSize > 50 && newSize < 500) {
        setCharacterSize(newSize);
      }
    }
  };

    // 전면/후면 카메라 전환
    const toggleCamera = () => {
      setFacingMode(facingMode === 'user' ? 'environment' : 'user');
    };
  

  // 사진 촬영 함수 (타이머 포함)
  const handleTakePhoto = () => {
    const takePhotoWithDelay = () => {
      const canvas = canvasRef.current;

      if (uploadedImage) {
        // 업로드된 이미지가 있는 경우, 그 이미지를 캔버스에 그리기
        const uploadedImg = new Image();
        uploadedImg.src = uploadedImage;
        uploadedImg.onload = () => {
          canvas.width = uploadedImg.width;
          canvas.height = uploadedImg.height;
          const context = canvas.getContext('2d');
          context.drawImage(uploadedImg, 0, 0, canvas.width, canvas.height);
          drawCharacterAndSave(context);
        };
      } else if (videoRef.current) {
        const video = videoRef.current;

        // video가 null이 아닌 경우만 처리
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawCharacterAndSave(context);
      } else {
        alert('카메라 또는 이미지가 정상적으로 로드되지 않았습니다.');
      }
    };

    // 타이머 카운트다운이 끝난 후 사진 촬영
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

  // 캐릭터와 함께 사진 저장 함수
  const drawCharacterAndSave = (context) => {
    if (selectedCharacter) {
      const img = new Image();
      img.src = selectedCharacter;
      img.onload = () => {
        context.drawImage(
          img,
          characterPosition.x,
          characterPosition.y,
          characterSize, // 크기를 반영하여 이미지 그리기
          characterSize
        );
        savePhoto();
      };
    } else {
      savePhoto();
    }
  };

  // 사진 저장 함수
  const savePhoto = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'photo_with_character.png';
    link.click();
  };

  return (
    <div
      className="ar-camera-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <header className="ar-camera-header">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload} // 파일 업로드 핸들러
          style={{ display: 'none' }}
          id="gallery-upload"
        />
        <label htmlFor="gallery-upload">
          <img src={galleryIcon} alt="Gallery" className="header-icon" />
        </label>
        <img src={cameraIcon} alt="Camera" className="header-icon" onClick={toggleCamera} />
        <img src={gridIcon} alt="Grid" className="header-icon" onClick={() => setGridVisible(!gridVisible)} />
        <img src={timerIcon} alt="Timer" className="header-icon" onClick={() => setTimer(3)} />
        <img src={flashIcon} alt="Flash" className="header-icon" />
      </header>

      <div className="camera-preview" onMouseDown={handleMouseDown}>
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
            style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : { transform: 'none' }}
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
            src={selectedCharacter}
            alt="Selected Character"
            className="selected-character"
            style={{
              top: `${characterPosition.y}px`,
              left: `${characterPosition.x}px`,
              width: `${characterSize}px`,
              height: `${characterSize}px`,
              position: 'absolute',
            }}
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
