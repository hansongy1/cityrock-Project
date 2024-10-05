import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzePreferences } from "../utils/preferences"; // 함수 임포트
import "../styles/InitialUser.css";
import Music from "../assets/keyword_001.png";
import Food from "../assets/keyword_002.png";
import Flower from "../assets/keyword_003.png";
import Nature from "../assets/keyword_004.png";
import Culture from "../assets/keyword_005.png";
import Firework from "../assets/keyword_006.jpg";
import Children from "../assets/keyword_007.jpg";
import Exercise from "../assets/keyword_008.png";
import PopupStore from "../assets/keyword_009.jpg";

const InitialUser = () => {
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();

    const keywords = [
        { id: 1, name: "뮤직", src: Music },
        { id: 2, name: "음식", src: Food },
        { id: 3, name: "꽃", src: Flower },
        { id: 4, name: "자연", src: Nature },
        { id: 5, name: "문화", src: Culture },
        { id: 6, name: "불꽃놀이", src: Firework },
        { id: 7, name: "어린이", src: Children },
        { id: 8, name: "운동", src: Exercise },
        { id: 9, name: "팝업", src: PopupStore }
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
        navigate("/");
    };

    // 선택된 항목 분석 (키워드 배열과 함께 넘겨줌)
    const mostPreferredItemName = analyzePreferences(selectedKeywords, keywords);

    return React.createElement(
        "div",
        { className: "algorithm-container" },
        React.createElement(
            "p",
            { className: "mainGuide" },
            "좋아하는 키워드를 3개 이상 선택하면 \n취향에 맞는 축제를 추천해드려요!"
        ),
        React.createElement(
            "p",
            { className: "guide" },
            "3개 이상의 키워드 선택이 필요해요!"
        ),
        React.createElement(
            "section",
            { className: "progress-bar" },
            React.createElement("div", {
                className: "progress",
                style: { width: progressBarWidth }
            })
        ),
        React.createElement(
            "section",
            { className: "category-items" },
            keywords.map((keyword) =>
                React.createElement(
                    "div",
                    {
                        className: `items-box ${selectedKeywords.includes(keyword.id) ? "selected" : ""}`,
                        key: keyword.id,
                        onClick: () => handleKeywordClick(keyword.id)
                    },
                    React.createElement(
                        "div",
                        { className: "keyword" },
                        React.createElement("img", {
                            src: keyword.src,
                            alt: keyword.name
                        }),
                        React.createElement("p", null, keyword.name)
                    )
                )
            )
        ),
        showButton &&
            React.createElement(
                "button",
                {
                    type: "button",
                    onClick: handleButtonClick,
                    className: "submitButton"
                },
                "완료"
            ),
        React.createElement(
            "div",
            null,
            React.createElement("h2", null, `가장 선호된 항목: ${mostPreferredItemName}`)
        )
    );
};

export default InitialUser;
