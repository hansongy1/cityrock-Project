import React from 'react';
import '../styles/FilterBar.css';

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <select className="filter-select">
        <option>지역</option>
        <option>성동구</option>
        <option>성북구</option>
        <option>서초구</option>
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
