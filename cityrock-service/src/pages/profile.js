import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/main.css'; /* 가운데 정렬 */
import { FaImage } from "react-icons/fa6";
import pic from '../assets/Group-205.png'; // 기본 이미지


Modal.setAppElement('#root'); // 모달을 사용할 때 필요한 설정

function App() {
  const [image, setImage] = useState(pic);  // 업로드된 이미지 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setImage(storedImage); // 로컬 스토리지에서 이미지 불러오기
    }
  }, []);
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem('profileImage', reader.result); // localStorage에 이미지 저장
      };
      reader.readAsDataURL(file);
    }
    //setShowModal(false); // 모달 닫기
  };

  const handleImageClick = () => {
    setShowModal(true); // 모달 열기
  };

  const handleDeleteImage = () => {
    setImage(pic); // 기본 이미지로 설정
    localStorage.removeItem('profileImage'); // 로컬 스토리지에서 이미지 제거
    setShowModal(false); // 모달 닫기
  };

  const customModalStyles = {
    overlay: {
      backgroundColor: 'transparent', // 배경 흐림 제거
    },
    content: {
      width: '150px',  // 너비 조정
      height: '165px', // 높이 조정
      margin: 'auto',
      borderRadius: '10px',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  const buttonStyle = {
    flex: 1, // 버튼을 동일한 비율로 늘리기
    padding: '17px',
    border: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd', // 아래 경계선
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '500',
  };

  const buttonColorStyles = {
    upload: { ...buttonStyle, color: '#2196F3' }, // 사진 올리기 버튼 색상
    delete: { ...buttonStyle, color: '#F44336' }, // 사진 삭제하기 버튼 색상
    cancel: { ...buttonStyle, color: '#0f0f0f', borderBottom: 'none' }, // 취소 버튼 색상
  };

  return (
    <div className='container'>
      <section className='contents'>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '250px' }}> 
          <img 
            src={image || pic } 
            alt='' 
            width="100" 
            height="100" 
            onClick={handleImageClick} // 이미지 클릭 시 모달 열기
            style={{ cursor: 'pointer', borderRadius: '50%' }} // 동그랗게 보이도록 설정
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} // 숨김 처리
            id="fileInput" // ID 추가
          />
          <div 
            onClick={handleImageClick} // 아이콘과 텍스트 클릭 시 모달 열기
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '15px' }}
          >
            <FaImage className="icon" size="17" color="Gray" /> 
            <span style={{ marginLeft: '6px', fontWeight: 550 }}>사진 올리기</span>
          </div>
        </div>

         {/* 모달 */}
        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customModalStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <button 
              style={buttonColorStyles.upload} 
              onClick={() => { document.getElementById('fileInput').click(); setShowModal(false); }}
            >
              사진 올리기
            </button>
            <button 
              style={buttonColorStyles.delete} 
              onClick={handleDeleteImage}
            >
              사진 삭제하기
            </button>
            <button 
              style={buttonColorStyles.cancel} 
              onClick={() => setShowModal(false)}
            >
              취소
            </button>
          </div>
        </Modal>
      </section>
    </div>
  );
}

export default App;