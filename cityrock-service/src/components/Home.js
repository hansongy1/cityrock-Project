import React, { useEffect, useState } from 'react';
import '../styles/main.css'; 
import { Carousel } from 'react-responsive-carousel';
import festivalmain1 from "../assets/festivalmain1.jpg";
import festivalmain2 from "../assets/festivalmain2.png";
import festivalmain3 from "../assets/festivalmain3.jpg";
import festivalmain4 from "../assets/festivalmain4.jpg";

const Home = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/users/check-login', { credentials: 'include' });
            setIsLoggedIn(response.ok);
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    };

    const fetchInitialRecommendations = async () => {
        if (isLoggedIn) {
            try {
                const response = await fetch('/api/recommendations/initial', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    
                    // 배열을 랜덤하게 섞은 뒤 상위 3개만 선택
                    const shuffledData = data.sort(() => Math.random() - 0.5).slice(0, 3);
                    
                    setRecommendations(shuffledData);
                }
            } catch (error) {
                console.error("Error fetching initial recommendations:", error);
            }
        }
    };
    

    const fetchUpdatedRecommendations = async () => {
        if (isLoggedIn) {
            try {
                const response = await fetch('/api/recommendations', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    
                    // 배열을 랜덤하게 섞은 뒤 상위 3개만 선택
                    const shuffledData = data.sort(() => Math.random() - 0.5).slice(0, 3);
                    
                    setRecommendations(shuffledData);
                }
            } catch (error) {
                console.error("Error fetching updated recommendations:", error);
            }
        }
    };

    const handleFestivalClick = async (festivalId) => {
        await fetch(`/api/festivals/updateRecent/${festivalId}`, {
            method: 'POST',
            credentials: 'include'
        });
        fetchUpdatedRecommendations();
    };

    useEffect(() => {
        checkLoginStatus();
        fetchInitialRecommendations();
    }, [isLoggedIn]);

    return (
        <section className="home-contents">
            <h1 className="home-p">New</h1>
            <div className="carousel-imgBox">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={3000}
                    stopOnHover={false}
                    swipeable={true}
                    centerMode={true}
                    centerSlidePercentage={84}
                    showArrows={false}
                    showIndicators={false}
                >
                    <div><img src={festivalmain1} alt="메인 축제 이미지 1" className="festival-carousel-image" /></div>
                    <div><img src={festivalmain2} alt="메인 축제 이미지 2" className="festival-carousel-image" /></div>
                    <div><img src={festivalmain3} alt="메인 축제 이미지 3" className="festival-carousel-image" /></div>
                    <div><img src={festivalmain4} alt="메인 축제 이미지 4" className="festival-carousel-image" /></div>
                </Carousel>
            </div>
            <div className="recommend">
                <div className="cate-title">
                    <h1 className="home-p">추천</h1>
                    <div className="makdagi-2" />
                </div>
                <div className='reco-contents'>
                    <p className='reco-text1'>당신에게 알맞은 컨텐츠를 추천해드릴게요!</p>
                    <div className="reco-alg">
                        {isLoggedIn ? (
                            recommendations.length > 0 ? (
                                recommendations.map((festival, index) => (
                                    <div key={index} className="alg-contents" onClick={() => handleFestivalClick(festival.id)}>
                                        <div className="alg-box">
                                            <img src={festival.image} alt={festival.name} className="alg-img" />
                                        </div>
                                        <p className="alg-title">{festival.name}</p>
                                        <p className="alg-loc">{festival.location}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="reco-text2">추천할 축제를 불러오는 중입니다...</p>
                            )
                        ) : (
                            <p className="reco-text2">
                                추천할 축제를 불러오는 중입니다...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
