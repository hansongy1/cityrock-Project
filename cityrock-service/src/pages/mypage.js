// MyPage.js
import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/MyPageReviews.css';
import { FaHeart, FaAngleRight, FaUserEdit, FaClipboardList, FaTimesCircle } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import pic from '../assets/Group-205.png';
import pic1 from '../assets/Group-271.png';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [image, setImage] = useState(null); // 프로필 이미지 상태
  const [username, setUsername] = useState(''); // 사용자 이름 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 및 사용자 정보 확인
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/mypage/user', {
          credentials: 'include', // 인증 정보를 포함하여 요청
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUsername(data.name); // 백엔드에서 가져온 사용자 이름 설정
          // 프로필 이미지 설정 (필요한 경우)
          if (data.profileImage) {
            setImage(`http://localhost:8080/profile-images/${data.profileImage}`);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // 로컬 스토리지에서 프로필 이미지 가져오기 (필요한 경우)
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('로그아웃 성공');
        navigate('/login');
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      alert('서버 오류로 로그아웃 할 수 없습니다.');
    }
  };

  // 회원 탈퇴 처리
  const handleConfirmWithdraw = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/delete-account', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('탈퇴되었습니다.');
        navigate('/');
      } else {
        alert('탈퇴 실패');
      }
    } catch (error) {
      console.error('탈퇴 처리 중 오류:', error);
      alert('서버 오류로 탈퇴할 수 없습니다.');
    }
  };

  // 모달 열기
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 프로필 이미지 변경 처리
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // 이미지 업로드를 위한 FormData 생성
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const response = await fetch('http://localhost:8080/api/mypage/editProfile', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setImage(`http://localhost:8080/profile-images/${data.profileImage}`);
          alert('프로필 이미지가 변경되었습니다.');
        } else {
          alert('프로필 이미지 변경 실패');
        }
      } catch (error) {
        console.error('프로필 이미지 변경 중 오류:', error);
        alert('서버 오류로 프로필 이미지를 변경할 수 없습니다.');
      }
    }
  };

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

  if (!isLoggedIn) {
    // 비로그인 상태의 화면
    return (
      <div className='container'>
        <section className='contents'>
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <img src={pic} alt='' width="100" height="100"/>
            <h2>로그인을 해주세요</h2>
            <div>
              <Link to="/register">
                <button className="custom-button" style={{ marginRight: '10px' }}>회원가입</button>
              </Link>
              <Link to="/login">
                <button className="custom-button">로그인</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 로그인 상태의 화면
  return (
    <div className='container'>
      <section className='contents'>
        <div style={{ textAlign: 'center', paddingTop: '30px' }}>
          <img
            src={image || pic}
            alt=''
            width="100"
            height="100"
            style={{ borderRadius: '50%' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ cursor: 'pointer', color: 'blue' }}>
            프로필 이미지 변경
          </label>
          <h2>{username || '사용자 이름'}</h2>
        </div>
        {/* 메뉴 리스트 */}
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ display: 'flex', alignItems: 'center', padding: '15px 0' }}>
            <FaUserEdit className="icon" size="20" color="Gray" style={{ marginLeft: '20px' }} />
            <span style={{ marginLeft: '10px', flexGrow: 1 }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                프로필 편집
              </Link>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginRight: '20px' }}/>
          </li>
          <hr style={{ margin: '0', borderColor: 'lightgray' }} />
          <li style={{ display: 'flex', alignItems: 'center', padding: '15px 0' }}>
            <FaHeart className="icon" size="20" color="Gray" style={{ marginLeft: '20px' }} />
            <span style={{ marginLeft: '10px', flexGrow: 1 }}>
              <Link to="/reviewfav" style={{ textDecoration: 'none', color: 'black' }}>
                스크랩한 게시물
              </Link>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginRight: '20px' }}/>
          </li>
          <hr style={{ margin: '0', borderColor: 'lightgray' }} />
          <li style={{ display: 'flex', alignItems: 'center', padding: '15px 0' }}>
            <FaClipboardList className="icon" size="20" color="Gray" style={{ marginLeft: '20px' }} />
            <span style={{ marginLeft: '10px', flexGrow: 1 }}>
              <Link to="/noticelist" style={{ textDecoration: 'none', color: 'black' }}>
                공지사항
              </Link>
            </span>
            <FaAngleRight className="icon" size="20" color="Gray" style={{ marginRight: '20px' }}/>
          </li>
          <hr style={{ margin: '0', borderColor: 'lightgray' }} />
          <li
            style={{ display: 'flex', alignItems: 'center', padding: '15px 0', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            <RiLogoutBoxRLine className="icon" size="20" color="Gray" style={{ marginLeft: '20px' }} />
            <span style={{ marginLeft: '10px', flexGrow: 1 }}>
              로그아웃
            </span>
          </li>
          <hr style={{ margin: '0', borderColor: 'lightgray' }} />
          <li
            style={{ display: 'flex', alignItems: 'center', padding: '15px 0', cursor: 'pointer' }}
            onClick={handleOpenModal}
          >
            <FaTimesCircle className="icon" size="20" color="Gray" style={{ marginLeft: '20px' }} />
            <span style={{ marginLeft: '10px', flexGrow: 1 }}>
              탈퇴
            </span>
          </li>
        </ul>
        {/* 탈퇴 확인 모달 */}
        <Modal isOpen={showModal} onRequestClose={handleCloseModal} style={customStyles}>
          <div style={{ textAlign: 'center' }}>
            <img src={pic1} alt='' width="40" height="40" style={{ marginBottom:'5px' }} />
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>도시.락을</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6363' }}> 탈퇴</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>하시나요?</span>
            </div>
            <p style={{ fontSize: '13px', marginBottom: '-10px' }}>탈퇴 버튼 선택 시,</p>
            <p style={{ fontSize: '13px' }}>계정은 삭제되며 복구되지 않습니다.</p>
            <div style={{ marginTop: '20px' }}>
              <button className="modal-exit" onClick={handleConfirmWithdraw} style={{ marginRight: '10px' }}>
                탈퇴
              </button>
              <button className="modal-cancel" onClick={handleCloseModal}>
                취소
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
}

export default MyPage;
