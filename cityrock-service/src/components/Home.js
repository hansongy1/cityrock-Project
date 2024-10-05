import React, { useEffect, useState, useRef } from 'react';
import '../styles/main.css'; // 가운데 정렬

import Favorite from "../assets/icon_favorite_border.png";// 클릭 전 아이콘
import Favorite_Fill from "../assets/icon_favorite_fill.png"; // 클릭 후 아이콘
import Ex from "../assets/festival2.png";

const CAROUSEL_IMAGES = [
    'https://kfescdn.visitkorea.or.kr/kfes/upload/contents/db/fe1f7525-8451-4fdf-9df6-eb99d5997be6_2.jpg',
    'https://kfescdn.visitkorea.or.kr/kfes/upload/contents/db/202a3575-509f-4e34-bbf8-59328d7b89eb_2.jpg',
    'https://kfescdn.visitkorea.or.kr/kfes/upload/contents/db/e1c228b3-40a2-4fbd-8b34-f70ac9070c8a_2.jpg',
];

const Carousel = ({ carouselList }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselList.length);
        }, 10000); // 3초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
    }, [carouselList.length]);

    const previousImageIndex = (currentImageIndex - 1 + carouselList.length) % carouselList.length;
    const nextImageIndex = (currentImageIndex + 1) % carouselList.length;


    // 자동 슬라이드
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        currentX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (currentX.current - startX.current > 50) {
            // 오른쪽에서 왼쪽으로 슬라이드
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carouselList.length) % carouselList.length);
        } else if (startX.current - currentX.current > 50) {
            // 왼쪽에서 오른쪽으로 슬라이드
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselList.length);
        }
    };

    return (
        <div className='carousel-container'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="carousel-container">
                <div className="carousel-item small">
                    <img src={carouselList[previousImageIndex]} alt="이전 슬라이드" />
                </div>
                <div className="carousel-item large">
                    <img src={carouselList[currentImageIndex]} alt="현재 슬라이드" />
                </div>
                <div className="carousel-item small">
                    <img src={carouselList[nextImageIndex]} alt="다음 슬라이드" />
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    // favorite icon
    const [favorite, setFavorite] = useState([false, false, false]); // 1. favorite 상태 초기값 설정

    const toggleFavorite = (index) => { // 2. toggleFavorite 함수 추가
        const newFavorite = [...favorite];
        newFavorite[index] = !newFavorite[index];
        setFavorite(newFavorite);
    };

    return (
        <section className="home-contents">
            <h1 className="home-p">New</h1>
            <div className="imgBox">
                <Carousel carouselList={CAROUSEL_IMAGES} />
            </div>
            <div className="culture-contents">
                <div className="cate-title">
                    <h1 className="home-p">문화 콘텐츠</h1>
                    <div className="makdagi-1" />
                </div>
                <div className="cate-box">
                    <div className="c-img">
                        <img src="" alt="" />
                    </div>
                    <div className="etc-text-1">
                        <p className="text-t">화려한 조명, 멋진 조명<br />그리고 열정적인 아티스트</p>
                        <p className="link-t">공연 바로가기</p>
                    </div>
                </div>
                <div className="cate-box">
                    <div className="c-img" />
                    <div className="etc-text-2">
                        <p className="text-t">현대적이고 창의적인</p>
                        <p className="link-t">전시회 바로가기</p>
                    </div>
                </div>
                <div className="cate-box">
                    <div className="c-img" />
                    <div className="etc-text-2">
                        <p className="text-t">다채로운 문화, 함성과 기쁨</p>
                        <p className="link-t">축제 바로가기</p>
                    </div>
                </div>
            </div>
            <div className="recommend">
                <div className="cate-title">
                    <h1 className="home-p">추천</h1>
                    <div className="makdagi-2" />
                </div>
                <div className='reco-contents'>
                    <p className='reco-text'>당신에게 알맞은 컨텐츠를 추천해드릴게요!</p>
                    <div className="reco-alg">
                        <div className='alg-contents'>
                            <div className='alg-box'>
                                <img src={Ex} alt="" className='alg-img'/>
                                <img 
                                    src={favorite[0] ? Favorite_Fill : Favorite} // 3. 상태에 따른 아이콘 설정
                                    alt='Favorite'
                                    className='alg-icon'
                                    onClick={() => toggleFavorite(0)} // 4. onClick 이벤트 핸들러 추가
                                />
                            </div>
                            <p className='alg-title'>곡성세계장미축제</p>
                            <p className='alg-loc'>전라남도 곡성군</p>
                        </div>
                        <div className='alg-contents'>
                            <div className='alg-box'>
                                <img src="" alt="" className='alg-img'/>
                                <img src={Favorite} alt='Favorite' className='alg-icon'/>
                            </div>
                            <p className='alg-title'>명</p>
                            <p className='alg-loc'>위치</p>
                        </div>
                        <div className='alg-contents'>
                            <div className='alg-box'>
                                <img src="" alt="" className='alg-img'/>
                                <img src={Favorite} alt='Favorite' className='alg-icon'/>
                            </div>
                            <p className='alg-title'>명</p>
                            <p className='alg-loc'>위치</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
