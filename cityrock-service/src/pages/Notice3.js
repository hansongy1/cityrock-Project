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
              <p>주차 안내</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', lineHeight: '1' }}>
            <hr style={{ margin: '0', width: '90%', borderTop: '1px solid lightGray' }} /></div>
            <div style={{ fontSize: '14px', textAlign: 'center' }}>
            <p>축제 기간 동안 주차 공간이 제한되어 있으니</p>
            <p>대중교통 이용을 권장합니다. 행사장 근처에는</p>
            <p>임시 주차장이 마련될 예정입니다.</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
