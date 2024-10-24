import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Festival.css';
import FilterBar from '../pages/FilterBar';

const FestivalInfo = () => {
  const [festivals, setFestivals] = useState([]);  // 축제 데이터를 저장할 state
  const [filteredFestivals, setFilteredFestivals] = useState([]);  // 필터링된 축제 데이터를 저장할 state
  const [loading, setLoading] = useState(true);    // 데이터 로딩 상태
  const [error, setError] = useState(null);        // 에러 상태

  const [region, setRegion] = useState('전체');  // 지역 필터 state
  const [category, setCategory] = useState('전체');  // 카테고리 필터 state
  const [sortOrder, setSortOrder] = useState('오름차순');  // 정렬 필터 state

  // API를 호출해서 축제 정보를 불러오는 함수
  useEffect(() => {
    fetch('http://localhost:8080/api/festivals')  // 백엔드 API 엔드포인트
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFestivals(data);  // 불러온 데이터를 state에 저장
        setFilteredFestivals(data); // 필터링된 데이터에 초기값 설정
        setLoading(false);   // 로딩 상태 종료
      })
      .catch(error => {
        console.error('Error fetching festivals:', error);
        setError(error);
        setLoading(false);   // 로딩 상태 종료
      });
  }, []);


  // 필터 변경 시 데이터를 필터링하는 함수
  useEffect(() => {
    let filtered = festivals;

    // 지역 필터링
    if (region !== '전체') {
      filtered = filtered.filter(festival => festival.location.includes(region));
    }

    // 카테고리 필터링
    if (category !== '전체') {
      filtered = filtered.filter(festival => festival.category === category);
    }

    // 정렬 처리
    if (sortOrder === '오름차순') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === '내림차순') {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredFestivals(filtered);  // 필터링된 데이터를 업데이트
  }, [region, category, sortOrder, festivals]);


  // 로딩 중일 때 표시
  // if (loading) {
  //   return (
  //     <div className="loading-container">
  //       <img src="/assets/icon_logo.png" alt="Loading..." className="loading-image" />
  //     </div>
  //   );
  // }

  // 에러 발생 시 표시
  if (error) {
    return <div>Error occurred: {error.message}</div>;
  }

  // 축제 데이터를 화면에 렌더링
  return (
    <div>
      <FilterBar setRegion={setRegion} setCategory={setCategory} setSortOrder={setSortOrder} />
      <div className="festival-list">
        {filteredFestivals.map((festival) => (
          <Link
            to={`/festival/${festival.id}`}
            key={festival.id}
            className="festival-card-link"
          >
            <div className="festival-card">
              <div className="festival-info">
                <h3>{festival.name}</h3> {/* CSV에서 name */}
                <div className="date-location">
                  <p className="bold-text">일시</p>
                  <p>| {festival.date}</p> {/* CSV에서 date */}
                </div>
                <div className="location">
                  <p className="bold-text">장소</p>
                  <p>| {festival.location}</p> {/* CSV에서 location */}
                </div>
              </div>
              <div className="image-container">
                <img
                  src={festival.image}  // 이미지 경로
                  alt={festival.name}
                  className="festival-image"
                />
                {/* <div className="dday-overlay">
                  {calculateDday(new Date(festival.startDate))}
                </div> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// D-Day 계산 함수(현재 안됨)
// const calculateDday = (startDate) => {
//   const today = new Date();
//   const eventStartDate = new Date(startDate); // startDate를 Date 객체로 변환
//   const timeDiff = eventStartDate - today;
//   const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//   return daysDiff > 0
//     ? `D-${daysDiff}`
//     : daysDiff === 0
//     ? 'D-Day'
//     : `D+${Math.abs(daysDiff)}`;
// };

export default FestivalInfo;