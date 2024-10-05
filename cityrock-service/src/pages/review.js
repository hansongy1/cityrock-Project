import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import pic from '../assets/add_a_photo.png';
import { PiStarFill, PiStarLight } from "react-icons/pi";
import Modal from 'react-modal';
import ReviewList from '../pages/reviewlist';


Modal.setAppElement('#root');

function App() {
  const [rating, setRating] = useState(0);
  const [isClicked, setIsClicked] = useState({
    사진이잘나와요: false,
    새로워요: false,
    음식이맛있어요: false,
    즐거워요: false,
    실망했어요: false,
    사람이많아요: false,
    추천하지않아요: false,
    기대이하예요: false
  });
  const [review, setReview] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  const Star = () => {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          (i < rating ? 
            <PiStarFill className="star-lg" key={i} color="#FFC700" size={25} onClick={() => setRating(i + 1)} /> :
            <PiStarLight className="star-lg" key={i} color="#FFC700" size={25} onClick={() => setRating(i + 1)} />
          )
        ))}
      </div>
    );
  }

  const handleButtonClick = (buttonName) => {
    // 현재 선택된 키워드 수를 계산
    const selectedCount = Object.keys(isClicked).filter(key => isClicked[key]).length;
  
    // 선택된 버튼이 이미 클릭된 경우 상태를 반전
    if (isClicked[buttonName]) {
      setIsClicked(prevState => ({
        ...prevState,
        [buttonName]: false
      }));
    } else {
      // 선택된 버튼이 3개 미만일 때만 클릭 가능
      if (selectedCount < 3) {
        setIsClicked(prevState => ({
          ...prevState,
          [buttonName]: true
        }));
      }
    }
  };

  const handleReviewChange = (event) => {
    const value = event.target.value;
    
    // 한글 기준으로 50자 제한
    if (value.length <= 50) {
      setReview(value);
      setButtonEnabled(value.trim() !== '');
    }
  };

  const handleReviewSubmit = () => {
    if (review.trim() === '' || rating === 0) return;

    const newReview = {
      rating,
      text: review,
      keywords: Object.keys(isClicked).filter(key => isClicked[key]),
      image: image
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
  
    // localStorage에 저장
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setReview('');
    setImage(null);
    setIsClicked({
      사진이잘나와요: false,
      새로워요: false,
      음식이맛있어요: false,
      즐거워요: false,
      실망했어요: false,
      사람이많아요: false,
      추천하지않아요: false,
      기대이하예요: false
    });
    setButtonEnabled(false);
    setRating(0);

    window.location.href = '/reviewlist';
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setShowModal(false);
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleDeleteImage = () => {
    setImage(null);
    setShowModal(false);
  };

  const customModalStyles = {
    content: {
      width: '150px',
      height: '165px',
      margin: 'auto',
      borderRadius: '10px',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  const buttonStyle = {
    flex: 1,
    padding: '17px',
    border: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '500',
  };

  const buttonColorStyles = {
    upload: { ...buttonStyle, color: '#2196F3' },
    delete: { ...buttonStyle, color: '#F44336' },
    cancel: { ...buttonStyle, color: '#0f0f0f', borderBottom: 'none' },
  };

  return (
    <div className='container'>
      <section className='contents'>
        <section style={{ display: 'flex', alignItems: 'center', marginLeft: '37px', marginTop: '-17px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '17px' }}>사진 첨부하기</p>
          <p style={{ fontSize: '15px', marginLeft: '5px' }}>(최대 5장)</p>
        </section>
        <div style={{ display: 'flex', marginTop: '-3px' }}>
          <div style={{ width: '93px', height: '93px', marginLeft: '37px', border: '1.6px solid lightGray', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={image || pic} 
            alt='' 
            onClick={handleImageClick} // 이미지 클릭 시 모달 열기
            style={{ cursor: 'pointer', borderRadius: '10%', width: image ? '100px' : 'auto',
            height: image ? '100px' : 'auto', objectFit: image ? 'cover' : 'contain' }} // 동그랗게 보이도록 설정
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} // 숨김 처리
            id="fileInput" // ID 추가
          />
          <div 
            onClick={handleImageClick} // 아이콘과 텍스트 클릭 시 모달 열기
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '15px' }}
          ></div>
          </div>
        </div>
        <div style={{ display: 'flex', marginLeft: '39px', marginTop: '8px' }}>
          {/* 별점 컴포넌트 추가 */}
          <Star />
        </div>
        <section style={{ display: 'flex', alignItems: 'center', marginLeft: '37px', marginTop: '-2px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '17px' }}>키워드 선택</p>
          <p style={{ fontSize: '15px', marginLeft: '5px' }}>(1개~5개)</p>
        </section>
        <div style={{ marginTop: '-5px' }}>
          {/* 각 버튼 추가 */}
          <button className={`keyword-button ${isClicked['사진이잘나와요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('사진이잘나와요')} style={{ marginLeft: '37px' }}>사진이 잘 나와요</button>
          <button className={`keyword-button ${isClicked['새로워요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('새로워요')} style={{ marginLeft: '4px' }}>새로워요</button>
          <button className={`keyword-button ${isClicked['음식이맛있어요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('음식이맛있어요')} style={{ marginLeft: '4px' }}>음식이 맛있어요</button>
          <button className={`keyword-button ${isClicked['즐거워요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('즐거워요')} style={{ marginLeft: '37px', marginTop: '6px' }}>즐거워요</button>
          <button className={`keyword-button ${isClicked['실망했어요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('실망했어요')} style={{ marginLeft: '4px' }}>실망했어요</button>
          <button className={`keyword-button ${isClicked['사람이많아요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('사람이많아요')} style={{ marginLeft: '4px' }}>사람이 많아요</button>
          <button className={`keyword-button ${isClicked['추천하지않아요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('추천하지않아요')} style={{ marginLeft: '37px', marginTop: '6px' }}>추천하지 않아요</button>
          <button className={`keyword-button ${isClicked['기대이하예요'] ? 'clicked' : ''}`} onClick={() => handleButtonClick('기대이하예요')} style={{ marginLeft: '4px' }}>기대 이하예요</button>
        </div>
        <section style={{ display: 'flex', alignItems: 'center', marginLeft: '37px', marginTop: '15px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '17px' }}>리뷰쓰기</p>
        </section>
        <textarea
          value={review}
          onChange={handleReviewChange}
          placeholder="다녀오신 축제가 어떠셨나요? 리뷰를 작성해 주세요"
          rows={6} // 원하는 행 수 설정
          cols={50} // 원하는 열 수 설정
          style={{ marginLeft: '37px', marginTop: '-12px', resize: 'none', borderRadius: '10px', fontSize: '13px', padding: '13px 13px', border: '1px solid lightgray', fontFamily: 'Arial, Helvetica, sans-serif' }} 
        />
        <button
          onClick={handleReviewSubmit}
          disabled={!buttonEnabled} // 버튼 활성화 상태에 따라 disabled 속성 사용
          style={{ marginLeft: '47px', marginTop: '18px', padding: '12px 137px', fontSize: '16px', backgroundColor: buttonEnabled ? '#000000' : '#A3A4B0', color: '#FFFFFF', border: 'none', borderRadius: '12px' }}
        > 
          리뷰 등록
        </button>

        {/* 리뷰 리스트 컴포넌트 추가 */}
        {false && <ReviewList reviews={reviews} />}

        {/* 모달 */}
        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customModalStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <button 
              style={buttonColorStyles.upload} 
              onClick={() => { document.getElementById('fileInput').click(); setShowModal(false); }}
            >
              사진 올리기
            </button>
            <button 
              style={buttonColorStyles.delete} 
              onClick={handleDeleteImage}
            >
              사진 삭제하기
            </button>
            <button 
              style={buttonColorStyles.cancel} 
              onClick={() => setShowModal(false)}
            >
              취소
            </button>
          </div>
        </Modal>
      </section>
    </div>
  );
}

export default App;