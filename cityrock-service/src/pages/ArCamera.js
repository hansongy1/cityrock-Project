import React, { useState, useRef, useEffect } from 'react';
import '../styles/ARCamera.css';
import cameraIcon from '../assets/cameraicon.png';
import flashIcon from '../assets/flashicon.png';
import galleryIcon from '../assets/galleryicon.png';
import timerIcon from '../assets/timericon.png';
import gridIcon from '../assets/gridicon.png';
import haechi from '../assets/haechi.png';
import bonggonge from '../assets/bonggonge.svg';
import yongyonge from '../assets/yongyonge.svg';
import herotoro from '../assets/herotoro.webp';
import parange from '../assets/parange.webp';
import camerabutton from '../assets/camerabutton.png';

const ArCamera = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterPosition, setCharacterPosition] = useState({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [characterSize, setCharacterSize] = useState(100);
  const [facingMode, setFacingMode] = useState('user');
  const [gridVisible, setGridVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerCount, setTimerCount] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraPreviewRef = useRef(null);

  const syncCanvasSizeWithPreview = () => {
    const preview = cameraPreviewRef.current;
    const canvas = canvasRef.current;
    if (preview && canvas) {
      const previewRect = preview.getBoundingClientRect();
      canvas.width = previewRect.width;
      canvas.height = previewRect.height;
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        syncCanvasSizeWithPreview();
      } catch (err) {
        console.error('카메라 시작 오류:', err);
        alert('카메라 접근이 거부되었거나 지원하지 않습니다.');
      }
    };

    if (!uploadedImage) {
      startCamera();
    }
  }, [facingMode, uploadedImage]);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

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

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && selectedCharacter) {
      const rect = cameraPreviewRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - rect.left; // 터치 좌표를 카메라 프리뷰 기준으로 변환
      const touchY = touch.clientY - rect.top;

      // 캐릭터가 있는 위치와 터치 위치의 거리 계산
      const distanceX = Math.abs(touchX - characterPosition.x);
      const distanceY = Math.abs(touchY - characterPosition.y);

      // 거리 기준을 설정하여 드래그 시작 여부 결정
      if (distanceX < characterSize && distanceY < characterSize) {
        setIsDragging(true);
        setDragOffset({
          x: touchX - characterPosition.x,
          y: touchY - characterPosition.y,
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const rect = cameraPreviewRef.current.getBoundingClientRect();
      setCharacterPosition({
        x: touch.clientX - rect.left - dragOffset.x,
        y: touch.clientY - rect.top - dragOffset.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    if (selectedCharacter) {
      const rect = cameraPreviewRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 캐릭터가 있는 위치와 클릭 위치의 거리 계산
      const distanceX = Math.abs(mouseX - characterPosition.x);
      const distanceY = Math.abs(mouseY - characterPosition.y);

      // 거리 기준을 설정하여 드래그 시작 여부 결정
      if (distanceX < characterSize && distanceY < characterSize) {
        setIsDragging(true);
        setDragOffset({
          x: mouseX - characterPosition.x,
          y: mouseY - characterPosition.y,
        });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = cameraPreviewRef.current.getBoundingClientRect();
      setCharacterPosition({
        x: e.clientX - rect.left - dragOffset.x,
        y: e.clientY - rect.top - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
    setTimer(isTimerActive ? 0 : 3);
  };

  const handleTakePhoto = () => {
    if (isTimerActive) {
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

  const takePhotoWithDelay = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    syncCanvasSizeWithPreview();

    const preview = cameraPreviewRef.current;
    const previewRect = preview.getBoundingClientRect();

    if (uploadedImage) {
      const uploadedImg = new Image();
      uploadedImg.src = uploadedImage;
      uploadedImg.onload = () => {
        const imgAspectRatio = uploadedImg.width / uploadedImg.height;
        const previewAspectRatio = previewRect.width / previewRect.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspectRatio > previewAspectRatio) {
          drawWidth = previewRect.width;
          drawHeight = drawWidth / imgAspectRatio;
          offsetX = 0;
          offsetY = (previewRect.height - drawHeight) / 2;
        } else {
          drawHeight = previewRect.height;
          drawWidth = drawHeight * imgAspectRatio;
          offsetX = (previewRect.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.drawImage(uploadedImg, offsetX, offsetY, drawWidth, drawHeight);
        drawCharacterAndSave(context, previewRect.width / canvas.width);
      };
    } else if (videoRef.current) {
      const video = videoRef.current;

      // 셀카 모드일 때 이미지 저장 시 좌우 반전
      if (facingMode === 'user') {
        context.translate(canvas.width, 0); // 좌우 반전
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, previewRect.width, previewRect.height);
      drawCharacterAndSave(context, previewRect.width / canvas.width);
    } else {
      alert('카메라 또는 이미지가 정상적으로 로드되지 않았습니다.');
    }
  };

  const drawCharacterAndSave = (context, scaleFactor) => {
    let marginRight = uploadedImage ? 53 : 0;

    if (selectedCharacter) {
      const img = new Image();
      img.src = selectedCharacter;
      img.onload = () => {
        context.drawImage(
          img,
          (characterPosition.x * scaleFactor) - marginRight,
          characterPosition.y * scaleFactor,
          characterSize * scaleFactor,
          characterSize * scaleFactor
        );
        savePhoto();
      };
    } else {
      savePhoto();
    }
  };

  const savePhoto = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'photo_with_character.png';
    link.click();
  };

  // 캐릭터 크기 조절 버튼 핸들러
  const increaseCharacterSize = () => {
    setCharacterSize((prevSize) => Math.min(prevSize + 10, 500)); // 최대 크기 500px
  };

  const decreaseCharacterSize = () => {
    setCharacterSize((prevSize) => Math.max(prevSize - 10, 50)); // 최소 크기 50px
  };

  return (
    <div
      className="ar-camera-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
        <img src={gridIcon} alt="Grid" className="header-icon" onClick={() => setGridVisible(!gridVisible)} />
        <img src={timerIcon} alt="Timer" className="header-icon" onClick={toggleTimer} />
        <img src={flashIcon} alt="Flash" className="header-icon" />
      </header>

      <div ref={cameraPreviewRef} className="camera-preview">
        {uploadedImage ? (
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="uploaded-image" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
            style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : { transform: 'scaleX(1)' }} // 후면 카메라일 때 왼쪽 반전
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

      <div className="size-controls">
        <button onClick={increaseCharacterSize}>+</button>
        <button onClick={decreaseCharacterSize}>-</button>
      </div>

      <img src={camerabutton} onClick={handleTakePhoto} alt="camera-button" />
    </div>
  );
};

export default ArCamera;
