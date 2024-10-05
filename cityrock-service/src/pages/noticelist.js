/* App.js */
import React from 'react';
// import { BrowserView, MobileView } from 'react-device-detect' /* 브라우저, 모바일 */
import '../styles/main.css'; /* 가운데 정렬 */

function App() {
  return (
    <div className='container'>
      <section className='contents'>
        <div style={{ flexDirection: 'column', alignItems: 'center', minHeight: '100vh'}}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <p style={{ textAlign: 'center' }}>공지사항</p>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'lightGray' }}></div>
          <div style={{ fontSize: '14px', textIndent: '20px' }}>
            <a href="http://localhost:3000/notice1" style={{ textDecoration: 'none', color: 'black' }}>
              <p>축제 일정 안내</p>
            </a>
          </div>
          <div style={{ width: '100%', height: '0.5px', backgroundColor: 'lightGray' }}></div>
          <div style={{ fontSize: '14px', textIndent: '20px' }}>
            <a href="http://localhost:3000/notice2" style={{ textDecoration: 'none', color: 'black' }}>
              <p>사전 등록 이벤트</p>
            </a>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'lightGray' }}></div>
          <div style={{ fontSize: '14px', textIndent: '20px' }}>
            <a href="http://localhost:3000/notice3" style={{ textDecoration: 'none', color: 'black' }}>
              <p>주차 안내</p>
            </a>
          </div>
          <div style={{ width: '100%', height: '0.5px', backgroundColor: 'lightGray' }}></div>
          <div style={{ fontSize: '14px', textIndent: '20px' }}>
            <a href="http://localhost:3000/notice4" style={{ textDecoration: 'none', color: 'black' }}>
              <p>자원봉사자 모집</p>
            </a>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'lightGray' }}></div>
        </div>
      </section>
    </div>
  );
}

export default App;