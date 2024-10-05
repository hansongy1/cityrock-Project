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
              <p>사전 등록 이벤트</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', lineHeight: '1' }}>
            <hr style={{ margin: '0', width: '90%', borderTop: '1px solid lightGray' }} /></div>
            <div style={{ fontSize: '14px', textAlign: 'center' }}>
            <p>축제에 사전 등록하시는 분들께 특별한 혜택을</p>
            <p>드립니다. 9월 10일까지 등록하시면 무료 기념품을</p>
            <p>제공하니 서둘러 신청하세요.</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
