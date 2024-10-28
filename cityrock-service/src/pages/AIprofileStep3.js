import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/AIprofileStep2.css';
import '../styles/AIprofileStep3.css';

const AIprofileStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const fileName = location.state?.fileName || ''; // 전달받은 파일 이름
  console.log("전달받은 파일 이름:", fileName); // 전달 확인


  const handleBackClick = () => {
    navigate(-1); // 뒤로 가기 기능
  };

  const keywords = [
    '불꽃놀이', '바다', '산', '겨울', '가을', '등불축제', '뮤직페스티벌', '장미 축제', '크리스마스'
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectOption = (option) => {
    if (!selectedKeywords.includes(option)) {
      setSelectedKeywords([...selectedKeywords, option]);
      setSelectedOption(option);
    }
    setIsDropdownOpen(false);
  };

  // 서버로 키워드와 파일 이름 제출
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/profile/keywords', {
        keywords: selectedKeywords,
        fileName,
      });
      console.log('응답된 파일 이름:', response.data.fileName);
      // 응답받은 파일 이름을 AIprofileCreating으로 전달
        navigate('/AIprofilecreating', { state: { fileName: response.data.fileName } });
    } catch (error) {
        console.error("서버와 연결 오류:", error);
    }
};

  return (
    <div className="aipictureuplode">
      <div className="header">
        <p onClick={handleBackClick} className="back">&lt;</p>
        <p className="step">3/3 Step</p>
      </div>
      <h2 className='festivalkeyword'>축제 키워드 선택</h2>
      <div className='festivaltxt'>
        <div className='subt'>축제 키워드를 선택하세요.</div>
        <p className='subt2'>선택하면 축제의 키워드에 맞게 사진 배경을 바꾸어줍니다.</p>
      </div>

      <div className="custom-dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
        <div className="dropdown" onClick={toggleDropdown}>
          {selectedOption || '선택하세요'}
        </div>
        {isDropdownOpen && (
          <div className="options">
            {keywords.map((keyword, index) => (
              <div key={index} className="option" onClick={() => selectOption(keyword)}>
                {keyword}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className='nextbtn' onClick={handleSubmit}>생성하러 가기</button>
    </div>
  );
};

export default AIprofileStep3;
