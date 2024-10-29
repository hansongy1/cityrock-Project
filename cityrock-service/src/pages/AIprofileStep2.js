import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AIprofileStep2.css';
import AIEX from '../assets/aiprofileex.png';
import AIEX1 from '../assets/aiprofileex1.png';

const AIprofileStep2 = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 파일을 저장할 state
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 저장할 state
  const fileInputRef = useRef(null); // input 파일 선택을 위해 참조 사용

  const handleBackClick = () => {
    navigate(-1); // 뒤로 가기 기능
  };

  // 파일 선택 시 실행되는 함수
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // 파일 선택
    if (file) {
      setSelectedImage(file); // 선택한 파일을 상태에 저장
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    }
  };

  // 파일 업로드 및 페이지 이동 함수
  const handleCreatingClick = async () => {
    if (!selectedImage) {
      alert('이미지를 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage); // 선택한 파일을 formData에 추가

    try {
      const response = await fetch('http://localhost:8080/profile/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 세션 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        if (data.fileName) { // fileName이 제대로 받아졌는지 확인
          navigate('/AIprofileStep3', { state: { fileName: data.fileName } });
      } else {
          alert('파일 이름을 찾을 수 없습니다.');
      }
  } else {
      alert('업로드 실패!');
  }
} catch (error) {
  console.error('업로드 중 에러 발생:', error);
  alert('업로드 중 문제가 발생했습니다.');
}
  };

  return (
    <div className="aipictureuplode">
      <div className="header">
        <p onClick={handleBackClick} className="back">
          &lt;
        </p>
        <p className="step">2/3 Step</p>
      </div>

      <div className="pictureuplode">사진 업로드</div>
      <img className="aiexample" src={AIEX} alt="aiprofileexample" />
      <div className="ait">
        얼굴이 선명하게 나온 셀피, 동일한 인물 사진, 다양한 <br />각도 / 배경 / 표정의
        사진
      </div>
      <img className="aiexample1" src={AIEX1} alt="aiprofileexample1" />
      <div className="ait1">
        단체 사진, 얼굴이 가려진 사진, 얼굴이 작게 나온<br /> 전신 사진, 노출이 심한
        사진, 흑백 사진
      </div>

      {/* 숨겨진 파일 선택 input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef} // input을 참조
        style={{ display: 'none' }} // 화면에 보이지 않도록 숨김
        onChange={handleImageChange} // 파일 선택 시 처리
      />

      <div className="pbutton">
        {/* 사진 선택 버튼 */}
        <button onClick={() => fileInputRef.current.click()} className="upload-button">
          사진 선택
        </button>
        {/* 사진 업로드 버튼 */}
        <button onClick={handleCreatingClick} className="upload-button" disabled={!selectedImage}>
          사진 업로드
        </button>
      </div>
    </div>
  );
};

export default AIprofileStep2;
