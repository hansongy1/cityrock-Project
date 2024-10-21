import React from 'react';
import '../styles/FilterBar.css';

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <select className="filter-select">
        <option>지역</option>
        <option>서울</option>
        <option>인천</option>
        <option>경기도</option>
        <option>강원도</option>
        <option>충청남도</option>
        <option>충청북도</option>
        <option>대전</option>
        <option>전라북도</option>
        <option>전라남도</option>
        <option>광주</option>
        <option>경상북도</option>
        <option>경상남도</option>
        <option>대구</option>
        <option>경상남도</option>
        <option>부산</option>
        <option>울산</option>
        <option>제주도</option>
      </select>
      <select className="filter-select">
        <option>카테고리</option>
        <option>음악</option>
        <option>먹거리</option>
        <option>꽃</option>
        <option>문화</option>
        <option>운동</option>
        <option>어린이</option>
        <option>불꽃놀이</option>
      </select>
      <select className="filter-select">
        <option>오름차순</option>
        <option>내림차순</option>
        {/* 시기 옵션 추가 */}
      </select>
    </div>
  );
};

export default FilterBar;
