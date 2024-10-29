// FestivalDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FestivalDetail.css';
import review from '../assets/review.png';
import dot from '../assets/dot.png';
import leftIcon from '../assets/fi-br-angle-left.png';

const FestivalDetail = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API를 호출해서 축제 정보를 불러오는 함수
  useEffect(() => {
    fetch(`http://localhost:8080/api/festivals/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFestival(data);
        setLoading(false);

        // 축제 정보를 가져온 후 사용자가 본 축제 목록을 업데이트
        updateRecentFestival(id);
      })
      .catch(error => {
        console.error('Error fetching festival details:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  // 사용자가 본 축제 정보를 백엔드에 저장
  const updateRecentFestival = async (festivalId) => {
    try {
      await fetch(`http://localhost:8080/api/festivals/updateRecent/${festivalId}`, {
        method: 'POST',
        credentials: 'include', // 로그인 세션을 포함하기 위해 필요
      });
    } catch (error) {
      console.error("Error updating recent festivals:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;
  if (!festival) return <div>축제를 찾을 수 없습니다.</div>;

  const goBack = () => navigate(-1);

  const handleReviewClick = () => {
    navigate('/reviewlist');
  };

  return (
    <div className="festival-detail">
      <div className="festival-content">
        <img
          src={festival.image}  // 축제 이미지
          alt={festival.name}
          className="festival-image-detail"
        />
        <div className='goBack'>
          <img src={leftIcon} onClick={goBack}/>
        </div>
        <div className="reviewImage"  onClick={handleReviewClick}>
          <img src={review} alt="축제 후기" />
          <p>후기</p>
        </div>
        <div className="festival-description">
          <h1>{festival.name}</h1> {/* 축제 이름 */}
          <p>📍장소: {festival.location}</p> {/* 축제 장소 */}
          <p>🗺️일시: {festival.date}</p> {/* 축제 일시 */}
          {festival.phone && <p>📞연락처: {festival.phone}</p>} {/* 연락처 */}
          <img className='dot3' src={dot} alt="점 세개" />
          <div className='detailBox'>
            {festival.description && (
              <div>
                <h4>소개</h4>
                <p>{festival.description}</p> {/* 축제 소개 */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetail;
