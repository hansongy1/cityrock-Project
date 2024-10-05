import React from 'react';
import { useParams } from 'react-router-dom'; // useParams를 import
import '../styles/FestivalDetail.css';
import image1 from '../assets/festival1.png';
import image2 from '../assets/festival2.png';
import image3 from '../assets/festival3.png';
import image4 from '../assets/festival4.png';
import image5 from '../assets/festival5.jpg';
import review from '../assets/review.png'; 
import dot from '../assets/dot.png';

const festivalDetails = [
  {
    id: 1,
    title: '차 없는 잠수교 \n 뚜벅뚜벅 축제',
    date: '2024.05.05 - 2024.06.23',
    location: '서울특별시 서초구 반포동 잠수교 및 반포 한강공원 일원',
    image: image1,
    contact: '02-1234-5678',
    introduce:
      '2024 차 없는 잠수교 뚜벅뚜벅 축제는 오감으로 만나는 힐링 놀이터의 컨셉으로 개최한다. 매주 일요일, 몸과 마음을 쉬어갈 수 있는 한강 위의 축제 놀이와 힐링을 동시에 즐기며 컬러풀한 한강으로 충전 할 수 있는 축제이다. 매주 특별한 프로그램과 다양한 공연, 힐링존, 푸드트럭 등을 준비하고, 전국의 농부들을 만나볼 수 있는 농부의 시장, 플리마켓, 놀이 체험 공간 등 다양한 즐길 거리를 구성하여 참여하는 행사 방문객들에게 즐거움과 휴식을 동시에 제공하고자 한다.',
  },
  {
    id: 2,
    title: '곡성세계장미축제',
    date: '2024.05.17 - 2024.05.26',
    location: '전라남도 곡성군 오곡면 기차마을로 232',
    image: image2,
    contact: '061-360-8471',
    introduce:
      '곡성군의 랜드마크인 <섬진강 기차마을>에서 75,000㎡ 규모의 대형 장미 정원에 1,004종의 유럽산 희귀 장미와 사계절 초화 수 만 본을 식재하여 이색적이고 화려한 볼거리를 제공하여 관외 및 해외 관광객을 유입하여 지역 관광 산업 견인과 지역 경제 활성화를 도모한다.',
  },
  {
    id: 3,
    title: '파주페어 북앤컬쳐',
    date: '2024.09.06 - 2024.09.08',
    location: '경기도 파주시',
    image: image3,
    contact: '031-240-3401',
    introduce: '작가와의 만남, 북마켓, 책 읽기 챌린지',
  },
  {
    id: 4,
    title: '안산 대부포도축제',
    date: '2024.09.28 - 2024.09.29',
    location: '경기도 안산시',
    image: image4,
    contact: '031-481-5921',
    introduce: '포도 수확 체험, 포도 와인 시음, 전통 음식 만들기',
  },
  {
    id: 5,
    title: '제주한순간 한식문화축제',
    date: '2024.08.28 - 2024.08.29',
    location: '제주도 서귀포시',
    image: image5,
    contact: '064-710-3310',
    introduce: '한식 요리 대회, 전통 음악 공연, 전통 놀이 체험',
  },
];

const FestivalDetail = () => {
  const { id } = useParams();
  const festival = festivalDetails.find(
    (festival) => festival.id === parseInt(id)
  );

  if (!festival) {
    return <div>축제를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="festival-detail">
      <div className="festival-content">
        <img
          src={festival.image}
          alt={festival.title}
          className="festival-image-detail"
        />
        <div className="review-image">
          <img src={review} alt="축제 후기" />
          <p>후기</p>
        </div>
        <div className="festival-description">
          <h1>{festival.title}</h1>
          <p>📍{festival.title}</p>
          <p>🗺️{festival.location}</p>
          <p>📅 {festival.date}</p>
          {festival.contact && <p>📞 {festival.contact}</p>}
          <img className='dot3' src={dot} alt="점 세개" />
          {festival.introduce && (
            <div>
              <h4>소개</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{festival.introduce}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FestivalDetail;
