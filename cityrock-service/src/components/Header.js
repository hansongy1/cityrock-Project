import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/main.css';

import Logo from '../assets/city-logo.png';
import MenuBar from '../assets/fi-sr-menu-burger.png';
import CloseIcon from '../assets/close.png';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가

  // 로그인 여부 확인
  useEffect(() => {
    const username = localStorage.getItem('username'); // 로컬 스토리지에서 username 확인
    if (username) {
      setIsLoggedIn(true); // 로그인 상태라면 true로 설정
    } else {
      setIsLoggedIn(false); // 아니면 false로 설정
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const pathsToHideHeader = [
    '/aiprofile',
    '/aiprofilestep1',
    '/aiprofilestep2',
    '/aiprofilestep3',
    '/aiprofilecreating', 
    '/arcamera',
  ];

  // 경로가 '/festival/'로 시작하고 '/festival' 자체가 아닌 경우
  const isHeaderHidden = pathsToHideHeader.includes(location.pathname) || (location.pathname.startsWith('/festival/') && location.pathname !== '/festival');

  if (isHeaderHidden) {
    return null; // 헤더를 숨김
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
            {/* 로그인 여부에 따라 마이페이지 경로 변경 */}
            {isLoggedIn ? (
              <Link to="/loginmypage">마이페이지</Link> // 로그인 시
            ) : (
              <Link to="/mypage">마이페이지</Link> // 비로그인 시
            )}
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
