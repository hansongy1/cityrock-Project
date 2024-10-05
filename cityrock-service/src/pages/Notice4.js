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
              <p>자원봉사자 모집</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', lineHeight: '1' }}>
            <hr style={{ margin: '0', width: '90%', borderTop: '1px solid lightGray' }} /></div>
            <div style={{ fontSize: '14px', textAlign: 'center' }}>
            <p>축제를 함께할 자원봉사자를 모집합니다!</p>
            <p>많은 분들의 참여로 더욱 풍성한 축제를 만들어</p>
            <p>가고자 합니다. 자세한 사항은 성동구청</p>
            <p>홈페이지에서 확인해 주세요.</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
