// LoginMyPage.js
import React, { useEffect, useState } from 'react';
import '../styles/main.css'; /* 가운데 정렬 */
import '../styles/MyPageReviews.css';
import { FaHeart, FaAngleRight, FaUserEdit, FaClipboardList, FaTimesCircle } from "react-icons/fa" // 10.08 수정 - 통합
import { RiLogoutBoxRLine } from "react-icons/ri";
import Modal from 'react-modal';
import pic from '../assets/Group-205.png'
import pic1 from '../assets/Group-271.png'
import { useNavigate } from 'react-router-dom';



Modal.setAppElement('#root');

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null); 
  const [username, setUsername] = useState(''); // 사용자 이름 상태 - 10.08 수정
  const navigate = useNavigate(); // useState 훅 사용 - 10.08 수정

  // logout 처리 - 10.08 수정
  const handleLogout = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('로그인 상태가 아닙니다.');
        navigate('/login');
        return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'  // 인증된 요청을 위해 추가
      });
      
      if (response.ok) {
        const data = await response.json();
        alert("로그아웃 성공");
        localStorage.removeItem('username'); // 로컬 스토리지에서 사용자 이름 삭제
        navigate('/login'); // 로그인 페이지로 리디렉션
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error('Error: ', error);
      alert("서버 오류로 로그아웃 할 수 없습니다.");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 탈퇴 처리 - 10.08 수정
  const handleConfirmWithdraw = async () => {

    // 로그인 여부 확인
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
        alert('로그인되지 않았습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8080/api/users/delete-account', {
            method: 'POST',
            credentials: 'include', // 인증된 요청을 위해 추가
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message || '탈퇴되었습니다.');
          localStorage.removeItem('username');
          navigate('/');
      } else {
          const errorData = await response.json();
          alert('탈퇴 실패: ' + (errorData.message || '알 수 없는 오류'));
      }
  } catch (error) {
      console.error('Error:', error);
      alert('서버 오류로 탈퇴할 수 없습니다.');
  }

  };

  const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          localStorage.setItem('profileImage', reader.result); // localStorage에 이미지 저장
        };
        reader.readAsDataURL(file);
      }
  };
  
  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기 - 10.08 수정
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('로그인되지 않았습니다. 로그인 페이지로 이동합니다.');
      navigate('/login'); // 로그인 페이지로 리디렉션
      return;
    } else {
        setUsername(storedUsername); // 사용자 이름 상태 업데이트
    }
      
    // if (storedUsername) {
    //   setUsername(storedUsername); // 사용자 이름 상태 업데이트
    // } else {
    //   navigate('/login'); // 로그인이 안 된 경우 로그인 페이지로 리디렉션 - 10.09 수정
    // }
      
      // 기존
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        setImage(storedImage); // localStorage에서 이미지 불러오기
    }
  }, []);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      width: "220px",
      height: "250px",
      margin: "auto",
      boxShadow: "0 3px 4px rgba(0, 0, 0, 0.2)",
      padding: "20px",
      borderRadius: "20px",
    },
  };

  return (
    <div className='container'>
      <section className='contents'>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '250px'}}> 
          <img src={image || pic} alt='' width="100" height="100" 
            style={{ borderRadius: '50%' }} // 동그랗게 보이도록 설정
          />
          <input type="file" accept="image/*" onChange={handleImageChange} 
            style={{ display: 'none' }} // 숨김 처리
            id="fileInput" // ID 추가
          />
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '-10px' }}>
            {/* <p>name</p> */}
            <p>{username || '사용자 이름'}</p> {/* 사용자 이름 표시 - 10.08 수정 */}
          </div>
          <div>
            <p style={{ fontSize: '14px', display: 'flex', alignItems: 'center', lineHeight: '1', marginTop: '-5px' }}>
            </p>
          </div>
        </div>
          <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1', marginBottom: '20px' }}>
            <FaUserEdit className="icon" size="20" color="Gray" style={{ marginLeft: '72px' }} />
            <span style={{ marginLeft: '8px', verticalAlign: 'middle', fontSize: '16px' }}>
              <a href="http://localhost:3000/profile" style={{ textDecoration: 'none', color: 'black' }}>
                프로필 편집
              </a>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '120px' }}/>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '5px' }}></div>
          </div>
          <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1', marginBottom: '20px' }}>
            <FaHeart className="icon" size="20" color="Gray" style={{ marginLeft: '70px' }} />
            <span style={{ marginLeft: '10px', verticalAlign: 'middle', fontSize: '16px'}}>
              <a href="http://localhost:3000/reviewfav" style={{ textDecoration: 'none', color: 'black' }}>
                스크랩한 게시물
              </a>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '88px' }}/>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '5px' }}></div>
          </div>
          <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1' }}>
            <FaClipboardList className="icon" size="20" color="Gray" style={{ marginLeft: '70px' }} />
            <span style={{ marginLeft: '10px', verticalAlign: 'middle', fontSize: '16px' }}>
              <a href="http://localhost:3000/noticelist" style={{ textDecoration: 'none', color: 'black' }}>
                공지사항
              </a>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginLeft: '140px' }}/>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '5px' }}></div>
          </div>
          <p style={{ fontSize: '16px', display: 'flex', alignItems: 'center', lineHeight: '1', marginBottom: '20px' }}>
            <RiLogoutBoxRLine className="icon" size="20" color="Gray" style={{ marginLeft: '70px' }} />
            {/* 10.08 수정 */}
            <span style={{ marginLeft: '10px', verticalAlign: 'middle', fontSize: '16px'}} onClick={handleLogout}>
              로그아웃
            </span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', height: '0.7px', backgroundColor: 'lightGray', marginBottom: '3px' }}></div>
          </div>
          <div>
            <p>
              <FaTimesCircle className="icon" size="20" color="Gray" style={{ marginLeft: '70px', verticalAlign: 'middle'}} />
              <button className="modal-button" onClick={handleOpenModal} style={{ marginLeft: '4px', verticalAlign: 'middle'}}>탈퇴</button>
            </p>
            <Modal isOpen={showModal} onRequestClose={handleCloseModal} style={customStyles}>
              <div className="modal" style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="modal-content" style={{ textAlign: 'center' }}>
                  <div>
                    <img src={pic1} alt='' width="40" height="40" style={{ marginBottom:'5px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>도시.락을</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6363' }}> 탈퇴</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>하시나요?</span>
                  </div>
                  <p style={{ fontSize: '13px', marginBottom: '-10px'}}>탈퇴 버튼 선택 시,</p>
                  <p style={{ fontSize: '13px'}}>계정은 삭제되며 복구되지 않습니다.</p>
                  <div style={{ justifyContent: 'center'}}>
                    <button className="modal-exit" onClick={handleConfirmWithdraw}>탈퇴</button>
                    <button className="modal-cancel" onClick={handleCloseModal}>취소</button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
      </section>
    </div>
  );
}