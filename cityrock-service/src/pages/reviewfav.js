// reviewfav.js
import React, { useEffect, useState } from 'react';
import LoGo from '../assets/image-45.png';
import { FaStar } from 'react-icons/fa';
import '../styles/MyPageReviews.css'; // 스타일 파일 임포트

const ReviewFav = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/users/scrapped-reviews', {
      credentials: 'include', // 쿠키를 포함하여 요청
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('스크랩한 리뷰를 가져오는 데 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Scrapped reviews:', data);
        setReviews(data);
      })
      .catch(error => {
        console.error('스크랩한 리뷰 가져오기 실패:', error);
        alert('스크랩한 리뷰를 가져오는 데 실패했습니다.');
      });
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
      <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', margin: '26px 0 -1px 32px' }}>스크랩한 리뷰</p>

      {reviews.length === 0 ? (
        <p style={{ marginLeft: '104px', fontWeight: 'bold', marginTop: '150px' }}>스크랩한 리뷰가 없습니다</p>
      ) : (
        <div className="review-grid-container">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                {renderStars(review.rating)}
                <p className="review-card-text">{review.content}</p>
              </div>
              <div className="keywords">
                {review.keywords?.map((keyword, idx) => (
                  <span key={idx} className="keyword-item">{keyword}</span>
                ))}
              </div>
              {review.image && (
                <div className="review-image-container">
                  <img src={`/uploads/${review.image}`} alt="리뷰 이미지" className="review-image" />
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
