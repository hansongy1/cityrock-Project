import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트
import "../styles/InitialUser.css";
import Music from "../assets/keyword_001.png";
import Food from "../assets/keyword_002.png";
import Flower from "../assets/keyword_003.png";
import Culture from "../assets/keyword_005.png";
import Firework from "../assets/keyword_006.jpg";
import Family from "../assets/keyword_007.jpg"; 

const InitialUser = () => {
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();

    const keywords = [
        { id: 1, name: "음악", src: Music }, 
        { id: 2, name: "먹거리", src: Food }, 
        { id: 3, name: "꽃", src: Flower },
        { id: 5, name: "문화", src: Culture },
        { id: 6, name: "불꽃놀이", src: Firework },
        { id: 7, name: "가족", src: Family } 
    ];

    const handleKeywordClick = (id) => {
        setSelectedKeywords((prevSelectedKeywords) => {
            const newSelectedKeywords = prevSelectedKeywords.includes(id)
                ? prevSelectedKeywords.filter((keywordId) => keywordId !== id)
                : [...prevSelectedKeywords, id];
            setShowButton(newSelectedKeywords.length >= 3);
            return newSelectedKeywords;
        });
    };

    const progressBarWidth = `${Math.min((selectedKeywords.length / 3) * 100, 100)}%`;

    const handleButtonClick = () => {
        const selectedKeywordNames = selectedKeywords.map(id => {
            const keyword = keywords.find(k => k.id === id);
            return keyword ? keyword.name : '';
        });
    
        fetch('http://localhost:8080/api/preferences/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 세션 쿠키를 보내기 위해 설정
            body: JSON.stringify(selectedKeywordNames),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to save preferences');
                }
                navigate('/');
            })
            .catch(error => {
                console.error('Error saving preferences:', error);
                alert('선호 키워드를 저장하는 중 오류가 발생했습니다.');
            });
    };
    

    return (
        <div className="algorithm-container">
            <p className="mainGuide">
                좋아하는 키워드를 3개를 선택하면 
                취향에 맞는 축제를 추천해드려요!
            </p>
            <p className="guide">3개의 키워드 선택이 필요해요!</p>
            <section className="progress-bar">
                <div className="progress" style={{ width: progressBarWidth }}></div>
            </section>
            <section className="category-items">
                {keywords.map((keyword) => (
                    <div
                        className={`items-box ${selectedKeywords.includes(keyword.id) ? "selected" : ""}`}
                        key={keyword.id}
                        onClick={() => handleKeywordClick(keyword.id)}
                    >
                        <div className="keyword">
                            <img src={keyword.src} alt={keyword.name} />
                            <p>{keyword.name}</p>
                        </div>
                    </div>
                ))}
            </section>
            {showButton && (
                <button type="button" onClick={handleButtonClick} className="submitButton">
                    완료
                </button>
            )}
        </div>
    );
};

export default InitialUser;
