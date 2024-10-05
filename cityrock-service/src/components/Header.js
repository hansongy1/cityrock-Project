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

  const pathsToHideHeader = ['/aiprofile', '/AIprofileStep1', '/AIprofileStep2', '/AIprofilecreating'];

  if (pathsToHideHeader.includes(location.pathname)) {
    return null; // 아무것도 렌더링하지 않음
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
            <Link to="/">AR 카메라</Link>
          </li>
          <li>
            <Link to="/">마이페이지</Link>
          </li>
          <li>
            <Link to="/login">로그인(임시)</Link>
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
