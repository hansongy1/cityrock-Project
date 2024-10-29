// FestivalDatail.js(축제를 클릭했을 때 보이는 축제 정보)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams를 import
import '../styles/FestivalDetail.css';
import review from '../assets/review.png';
import dot from '../assets/dot.png';
import leftIcon from '../assets/fi-br-angle-left.png'
// import { useNavigate } from 'react-router-dom';


const FestivalDetail = () => {
  const { id } = useParams(); // URL에서 축제 ID를 가져옴
  const [festival, setFestival] = useState(null); // 축제 정보를 저장할 state
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  // API를 호출해서 축제 정보를 불러오는 함수
  useEffect(() => {
    fetch(`http://localhost:8080/api/festivals/${id}`)  // 백엔드 엔드포인트
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFestival(data);  // 불러온 데이터를 state에 저장
        setLoading(false);   // 로딩 상태 종료
      })
      .catch(error => {
        console.error('Error fetching festival details:', error);
        setError(error);
        setLoading(false);   // 로딩 상태 종료
      });
  }, [id]);

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러 발생 시 표시
  if (error) {
    return <div>Error occurred: {error.message}</div>;
  }

  // 축제 데이터를 화면에 렌더링
  if (!festival) {
    return <div>축제를 찾을 수 없습니다.</div>;
  }

  // 뒤로 가기 Btn
  const goBack = () => {
    navigate(-1);
  }

  // 후기 Btn
  const handleReviewClick = () => {
    navigate('/reviewlist'); // 버튼 클릭 시 '/review'로 이동
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
