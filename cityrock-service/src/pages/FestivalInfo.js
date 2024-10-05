import React from 'react';
import { Link } from 'react-router-dom'; // Link를 import
import '../styles/Festival.css';
import FilterBar from '../pages/FilterBar';

import image1 from '../assets/festival1.png';
import image2 from '../assets/festival2.png';
import image3 from '../assets/festival3.png';
import image4 from '../assets/festival4.png';
import image5 from '../assets/festival5.jpg';

const festivals = [
  {
    id: 1,
    title: '차 없는 잠수교 뚜벅뚜벅 축제',
    date: '2024.05.05 - 2024.06.23',
    location: '서울 서초구',
    image: image1,
    startDate: new Date('2024-05-05'),
  },
  {
    id: 2,
    title: '곡성세계장미축제',
    date: '2024.05.17 - 2024.05.26',
    location: '전라남도 곡성군',
    image: image2,
    startDate: new Date('2024-05-17'),
  },
  {
    id: 3,
    title: '파주페어 북앤컬쳐',
    date: '2024.09.06 - 2024.09.08',
    location: '경기도 파주시',
    image: image3,
    startDate: new Date('2024-09-06'),
  },
  {
    id: 4,
    title: '안산 대부포도축제',
    date: '2024.09.28 - 2024.09.29',
    location: '경기도 안산시',
    image: image4,
    startDate: new Date('2024-09-28'),
  },
  {
    id: 5,
    title: '제주한순간 한식문화축제',
    date: '2024.08.28 - 2024.08.29',
    location: '제주도 서귀포시',
    image: image5,
    startDate: new Date('2024-08-28'),
  },
];

const calculateDday = (startDate) => {
  const today = new Date();
  const timeDiff = startDate - today;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff > 0
    ? `D-${daysDiff}`
    : daysDiff === 0
    ? 'D-Day'
    : `D+${Math.abs(daysDiff)}`;
};

const FestivalInfo = () => {
  return (
    <div>
      <FilterBar />
      <div className="festival-list">
        {festivals.map((festival) => (
          <Link
            to={`/festival/${festival.id}`}
            key={festival.id}
            className="festival-card-link"
          >
            <div className="festival-card">
              <div className="festival-info">
                <h3>{festival.title}</h3>
                <div className="date-location">
                  <p className="bold-text">일시</p>
                  <p>| {festival.date}</p>
                </div>
                <div className="location">
                  <p className="bold-text">장소</p>
                  <p>| {festival.location}</p>
                </div>
              </div>
              <div className="image-container">
                <img
                  src={festival.image}
                  alt={festival.title}
                  className="festival-image"
                />
                <div className="dday-overlay">
                  {calculateDday(festival.startDate)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FestivalInfo;
