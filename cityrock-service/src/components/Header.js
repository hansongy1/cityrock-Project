import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/main.css';

import Logo from '../assets/city-logo.png';
import MenuBar from '../assets/fi-sr-menu-burger.png';
import CloseIcon from '../assets/close.png';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // 경로명을 모두 소문자로 일관되게 맞춤
  const pathsToHideHeader = [
    '/aiprofile',
    '/aiprofilestep1',
    '/aiprofilestep2',
    '/aiprofilecreating', // 대소문자 일치하도록 수정
    '/arcamera',
  ];

  // 경로를 소문자로 변환해서 비교
  if (pathsToHideHeader.includes(location.pathname.toLowerCase())) {
    return null; // 헤더 숨김
  }

  return (
    <header className="App-header">
      <section className="App-menu" onClick={toggleMenu}>
        <img src={MenuBar} alt="Menu Bar" />
      </section>
      <section className="App-logo">
        <img src={Logo} alt="Logo" />
      </section>
      <nav className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <img
          src={CloseIcon}
          alt="close-icon"
          className="close-icon"
          onClick={toggleMenu}
        />
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/">공연</Link>
          </li>
          <li>
            <Link to="/">전시</Link>
          </li>
          <li>
            <Link to="/festival">축제</Link>
          </li>
          <li>
            <Link to="/aiprofile">AI 프로필</Link>
          </li>
          <li>
            <Link to="/arcamera">AR 카메라</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
          <li>
            <Link to="/login">로그인</Link>
          </li>
        </ul>
      </nav>
      {isMenuOpen && (
        <div className="side-menu-overlay" onClick={toggleMenu}></div>
      )}
    </header>
  );
};

export default Header;
