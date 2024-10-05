import React, { useEffect, useState } from 'react';
import LoGo from '../assets/image-45.png';
import { FaStar } from 'react-icons/fa';

const ReviewFav = () => {
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    const storedLikes = localStorage.getItem('likedReviews');

    if (storedReviews) {
      const reviewsData = JSON.parse(storedReviews);
      setReviews(reviewsData);
    }

    if (storedLikes) {
      const likedReviewsData = JSON.parse(storedLikes);
      setLikedReviews(likedReviewsData);
    }
  }, []);

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
    <div className="review-fav">
      <img src={LoGo} alt='LoGo' className="logo-image" />
      <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', margin: '26px 0 -1px 32px' }}>좋아요 한 리뷰</p>

      {likedReviews.length === 0 ? (
        <p style={{ marginLeft: '104px', fontWeight: 'bold', marginTop: '150px' }}>좋아요한 리뷰가 없습니다</p>
      ) : (
        <div className="review-grid-container">
          {likedReviews.map((index) => (
            <div key={index} className="review-card">
              <div className="review-card-header">
                {renderStars(reviews[index]?.rating)}
                <p className="review-card-text">{reviews[index]?.text}</p>
              </div>
              <div className="keywords">
                {reviews[index]?.keywords?.map((keyword, idx) => (
                  <span key={idx} className="keyword-item">{keyword}</span>
                ))}
              </div>
              {reviews[index]?.image && (
                <div className="review-image-container">
                  <img src={reviews[index]?.image} alt="리뷰 이미지" className="review-image" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewFav;
