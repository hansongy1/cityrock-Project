import React, { useEffect, useState, useRef } from 'react';
import '../styles/main.css'; // 스타일 import
import { Carousel } from 'react-responsive-carousel';
import Ex from "../assets/festival2.png";
import festivalmain1 from "../assets/festivalmain1.jpg";
import festivalmain2 from "../assets/festivalmain2.png";
import festivalmain3 from "../assets/festivalmain3.jpg";
import festivalmain4 from "../assets/festivalmain4.jpg";


const Home = () => {
    // favorite icon
    const [favorite, setFavorite] = useState([false, false, false]);

    const toggleFavorite = (index) => {
        const newFavorite = [...favorite];
        newFavorite[index] = !newFavorite[index];
        setFavorite(newFavorite);
    };

    return (
        <section className="home-contents">
            <h1 className="home-p">New</h1>
            <div className="carousel-imgBox">
            <Carousel
            showThumbs={false} // 썸네일 숨기기
            showStatus={false} // 상태 숨기기
            infiniteLoop={true} // 무한 루프
            autoPlay={true} // 자동 재생
            interval={3000} // 3초마다 이미지 넘기기
            stopOnHover={false} // 마우스 호버 시 일시정지하지 않음
            swipeable={true} // 스와이프 가능
            centerMode={true} // 중앙에 이미지 배치
            centerSlidePercentage={84} // 중앙 슬라이드의 크기 조정
            showArrows={false} // 화살표 숨기기
            showIndicators={false} // 이미지 순서 숨기기
        >
            <div>
                <img src={festivalmain1} alt="메인 축제 이미지 1" className="festival-carousel-image" />
            </div>
            <div>
                <img src={festivalmain2} alt="메인 축제 이미지 2" className="festival-carousel-image" />
            </div>
            <div>
                <img src={festivalmain3} alt="메인 축제 이미지 3" className="festival-carousel-image" />
            </div>
            <div>
                <img src={festivalmain4} alt="메인 축제 이미지 4" className="festival-carousel-image" />
            </div>
        </Carousel>

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
                                <img src={Ex} alt="" className='alg-img' />
                            </div>
                            <p className='alg-title'>곡성세계장미축제</p>
                            <p className='alg-loc'>전라남도 곡성군</p>
                        </div>
                        <div className='alg-contents'>
                            <div className='alg-box'>
                                <img src="" alt="" className='alg-img' />
                            </div>
                            <p className='alg-title'>명</p>
                            <p className='alg-loc'>위치</p>
                        </div>
                        <div className='alg-contents'>
                            <div className='alg-box'>
                                <img src="" alt="" className='alg-img' />
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
