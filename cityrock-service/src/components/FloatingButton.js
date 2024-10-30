// FloatingButton.js
import React from 'react';
import { Link } from 'react-router-dom';

const FloatingButton = ({ id }) => {
  return (
    <Link to={`/festivals/${id}/reviews/add`} className="floating-button">
      <button className="floating-btn">
        <span>+</span>
      </button>
    </Link>
  );
};

export default FloatingButton;
