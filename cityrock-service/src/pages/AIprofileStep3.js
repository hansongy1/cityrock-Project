import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AIprofileStep2.css';
import '../styles/AIprofileStep3.css';

const AIprofileStep3 = () => {
  const navigate = useNavigate();
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCreatingClick = () => {
    navigate('/AIprofilecreating');
  };

  const keywords = [
    '불꽃놀이',
    '바다',
    '산',
    '겨울',
    '가을',
    '등불축제',
    '뮤직페스티벌',
    '장미 축제',
    '크리스마스',
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

  const handleMouseEnter = () => {
    setIsDropdownOpen(true); // 마우스가 올려지면 드롭다운 열기
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false); // 마우스가 나가면 드롭다운 닫기
  };

  const handleSubmit = () => {
    console.log('선택된 키워드:', selectedKeywords);
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

      <div 
        className="custom-dropdown" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="dropdown" onClick={toggleDropdown}>
          {selectedOption || '선택하세요'}
        </div>
        {isDropdownOpen && (
          <div className="options">
            {keywords.map((keyword, index) => (
              <div 
                key={index} 
                className="option" 
                onClick={() => selectOption(keyword)}
              >
                {keyword}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className='nextbtn' onClick={handleCreatingClick}>생성하러 가기</button>
    </div>
  );
};

export default AIprofileStep3;
