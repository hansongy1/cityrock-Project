// MyPage.js
import React from 'react';
// import Header from "../components/Header";
import '../styles/main.css'; /* 가운데 정렬 */
import '../styles/MyPageReviews.css'; /* 가운데 정렬 */
import { FaBookmark } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { Link } from 'react-router-dom';
import pic from '../assets/Group-205.png'

function App() {
    return (
      <div className='container'>
        <section className='contents'>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '250px'}}> 
            <img src={pic} alt='' width="100" height="100"/>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              <p>로그인을 해주세요</p>
            </div>
            <div>
              {/* 10.07 회원가입, 로그인 경로 추가 */}
              <Link to="/register">
                <button className="custom-button" style={{ marginRight: '10px' }}>
                  회원가입
                </button>
              </Link>
              <Link to="/login">
                <button className="custom-button">로그인</button>
              </Link>
            </div>
            </div>
            <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1', marginBottom: '20px' }}>
              <FaUserEdit className="icon" size="20" color="Gray" style={{ marginLeft: '72px' }} />
              <span style={{ marginLeft: '8px', verticalAlign: 'middle', fontSize: '16px' }}>프로필 편집</span>
              <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '120px' }}/>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '5px' }}></div>
            </div>
            <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1', marginBottom: '20px' }}>
              <FaBookmark className="icon" size="20" color="Gray" style={{ marginLeft: '70px' }} />
              <span style={{ marginLeft: '10px', verticalAlign: 'middle', fontSize: '16px'}}>스크랩한 게시물</span>
              <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '88px' }}/>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '5px' }}></div>
            </div>
            <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1' }}>
              <FaClipboardList className="icon" size="20" color="Gray" style={{ marginLeft: '70px' }} />
              <span style={{ marginLeft: '10px', verticalAlign: 'middle', fontSize: '16px' }}>공지사항</span>
              <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '140px' }}/>
            </p>
        </section>
      </div>
    );
  }

  export default App;