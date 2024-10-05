import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/review'); // '/review' 경로로 이동
  };

  return (
    <button className="floating-btn" onClick={handleClick}>
      <span>+</span>
    </button>
  );
};

export default FloatingButton;