import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Header from "./components/Header";
import './styles/main.css';
import Home from "./components/Home";
import FestivalInfo from './pages/FestivalInfo';
import FestivalDetail from './pages/FestivalDetail';
import AIprofile from './pages/AIprofile';
import AIprofileStep1 from './pages/AIprofileStep1';
import AIprofileStep2 from './pages/AIprofileStep2';
import AIprofileCreating from './pages/AIprofileCreating';
import MyPage from './pages/mypage';
import LoginMyPage from './pages/LoginMyPage';
import Profile from './pages/profile';
import Noticelist from './pages/noticelist.js';
import Notice1 from './pages/Notice1.js';
import Notice2 from './pages/Notice2.js';
import Notice3 from './pages/Notice3.js';
import Notice4 from './pages/Notice4.js';
import Review from './pages/review.js';
import Reviewlist from './pages/reviewlist.js';
import Reviewfav from './pages/reviewfav.js';
import InitialUser from './pages/InitialUser';
import Login from './pages/Login';
import Register from './pages/Register';
import AfterHome from './components/AfterHome';
import ArCamera from './pages/ArCamera';

function App() {
  return (
    <Router>
      <div className='container'>
        <section className='contents'>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/initialUser" element={<InitialUser />} />
            <Route path="/festival" element={<FestivalInfo />} />
            <Route path="/festival/:id" element={<FestivalDetail />} />
            <Route path="/aiprofile" element={<AIprofile />} />
            <Route path="/aiprofilestep1" element={<AIprofileStep1 />} />
            <Route path="/aiprofilestep2" element={<AIprofileStep2 />} />
            <Route path="/aiprofilecreating" element={<AIprofileCreating />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/loginmypage" element={<LoginMyPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/noticelist" element={<Noticelist />} />
            <Route path="/notice1" element={<Notice1 />} />
            <Route path="/notice2" element={<Notice2 />} />
            <Route path="/notice3" element={<Notice3 />} />
            <Route path="/notice4" element={<Notice4 />} />
            <Route path="/review" element={<Review />} />
            <Route path="/reviewlist" element={<Reviewlist />} />
            <Route path="/reviewfav" element={<Reviewfav/>} />
            <Route path="/afterHome" element={<AfterHome />} />
            <Route path="/arcamera" element={<ArCamera />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
