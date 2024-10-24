import React from 'react';
import '../styles/FilterBar.css';

const FilterBar = ({ setRegion, setCategory, setSortOrder }) => {
  // 각 필터가 변경될 때 호출할 함수들
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="filter-bar">
      <select className="filter-select" onChange={handleRegionChange}>
        <option value="전체">지역</option>
        <option value="서울">서울</option>
        <option value="인천">인천</option>
        <option value="대전">대전</option>
        <option value="대구">대구</option>
        <option value="광주">광주</option>
        <option value="부산">부산</option>
        <option value="울산">울산</option>
        <option value="세종시">세종시</option>
        <option value="경기도">경기도</option>
        <option value="강원특별자치도">강원특별자치도</option>
        <option value="충청북도">충청북도</option>
        <option value="충청남도">충청남도</option>
        <option value="경상북도">경상북도</option>
        <option value="경상남도">경상남도</option>
        <option value="전북특별자치도">전북특별자치도</option>
        <option value="전라남도">전라남도</option>
        <option value="제주도">제주도</option>
      </select>
      <select className="filter-select" onChange={handleCategoryChange}>
        <option value="전체">카테고리</option>
        <option value="가족">가족</option>
        <option value="꽃">꽃</option>
        {/* <option value="먹거리">먹거리</option> */}
        <option value="문화">문화</option>
        <option value="불꽃놀이">불꽃놀이</option>
        {/* <option value="어린이">어린이</option> */}
        <option value="운동">운동</option>
        <option value="음악">음악</option>
      </select>
      <select className="filter-select" onChange={handleSortOrderChange}>
        <option value="오름차순">오름차순</option>
        <option value="내림차순">내림차순</option>
      </select>
    </div>
  );
};

export default FilterBar;
