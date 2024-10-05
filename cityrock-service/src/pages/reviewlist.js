import React, { useEffect, useState } from 'react';
import LoGo from '../assets/image-45.png';
import FloatingButton from '../components/FloatingButton';
import { FaStar, FaHeart } from 'react-icons/fa';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }

    const storedLikes = localStorage.getItem('likedReviews');
    if (storedLikes) {
      setLikedReviews(JSON.parse(storedLikes));
    }
  }, []);

  const toggleLike = (index) => {
    const updatedLikes = [...likedReviews];
    if (updatedLikes.includes(index)) {
      updatedLikes.splice(updatedLikes.indexOf(index), 1);
    } else {
      updatedLikes.push(index);
    }
    setLikedReviews(updatedLikes);
    localStorage.setItem('likedReviews', JSON.stringify(updatedLikes));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    return (
      <div className="rating">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="rating-star" />
        ))}
        {halfStar && <FaStar className="rating-star" style={{ color: "#FFC700" }} />}
      </div>
    );
  };

  return (
    <div className="review-list">
      {/* 헤더 포함 상단 레이아웃 */}
      <img src={LoGo} alt='LoGo' className="logo-image" />
      <p className="header-title">축제 후기</p>
      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="no-review-text">등록된 리뷰가 없습니다</p>
      ) : (
        <div className="review-grid-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
            <div className="review-info">
              {/* 별점 */}
              {renderStars(review.rating)}
          
              {/* 리뷰 텍스트 */}
              <p className="review-text">{review.text}</p>
          
              {/* 키워드 목록 */}
              <div className="keywords">
                {review.keywords.map((keyword, idx) => (
                  <span key={idx} className="keyword-item">{keyword}</span>
                ))}
              </div>
            </div>
            {review.image && (
              <div className="review-image-container">
                <img src={review.image} alt="리뷰 이미지" className="review-image" />
                <FaHeart
                  onClick={() => toggleLike(index)}
                  className={`heart-icon ${likedReviews.includes(index) ? 'liked' : ''}`}
                />
              </div>
            )}
          </div>
          
          ))}
        </div>
      )}
      <FloatingButton />
    </div>
  );
};

export default ReviewList;
