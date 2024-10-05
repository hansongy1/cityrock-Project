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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '330px', height: '350px', border: '2px solid lightGray', borderRadius: '10px', padding: '10px' }}>
            <div style={{ fontSize: '14px', textIndent: '33px' }}>
              <p>축제 일정 안내</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', lineHeight: '1' }}>
            <hr style={{ margin: '0', width: '90%', borderTop: '1px solid lightGray' }} /></div>
            <div style={{ fontSize: '14px', textAlign: 'center' }}>
            <p>이번 한양여자대학교 축제는 2024년 9월 11일부터</p>
            <p>9월 12일까지 진행됩니다. 다양한 프로그램과</p>
            <p>이벤트가 준비되어 있으니 많은 참여 부탁드립니다!</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
