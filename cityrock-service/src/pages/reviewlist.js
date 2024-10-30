// reviewlist.js(리뷰 목록)
import React, { useEffect, useState } from 'react';
import FloatingButton from '../components/FloatingButton';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import '../styles/MyPageReviews.css';

const ReviewList = () => {
  const { id } = useParams(); // 후기: 축제 ID를 URL에서 가져옴
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 특정 축제에 해당하는 리뷰 목록을 백엔드에서 가져옴
    fetch(`http://localhost:8080/api/festivals/${id}/reviews`)
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('리뷰 가져오기 실패:', error));
  }, [id]);

  const toggleLike = (reviewId) => {
    fetch(`http://localhost:8080/api/festivals/${id}/reviews/${reviewId}/scrap`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('스크랩 처리 중 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Scrap status:', data.isScrapped); // 디버깅용 로그
          // 스크랩 상태 업데이트
          setReviews(prevReviews => prevReviews.map(review => {
              if (review.id === reviewId) {
                  return { ...review, scrapped: data.isScrapped };
              }
              return review;
          }));
      })
      .catch(error => {
          console.error('스크랩 처리 실패:', error);
          alert('스크랩 처리에 실패했습니다.');
      });
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
              <p className="review-text">{review.content}</p>
          
              {/* 키워드 목록 */}
              <div className="keywords">
                {review.keywords.map((keyword, idx) => (
                  <span key={idx} className="keyword-item">{keyword}</span>
                ))}
              </div>
            </div>
            {review.image && (
              <div className="review-image-container">
                <img src={`/uploads/${review.image}`} alt="리뷰 이미지" className="review-image" />
                <FaHeart
                    onClick={() => toggleLike(review.id)}
                    className={`heart-icon ${review.scrapped ? 'liked' : ''}`}
                />
              </div>
            )}
          </div>
          ))}
        </div>
      )}
      <FloatingButton id={id} />
    </div>
  );
};

export default ReviewList;
