import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';
import { Outlet } from 'react-router';
import ScrollNotice from '../../components/ScrollNotice/ScrollNotice';
import EventSwiper from '../../components/Swiper/EventSwiper';
import NoticeBord from '../../components/NoticeBord/NoticeBord';

const Home = () => {
  return (
    <div >
      <div>
        <ScrollNotice />
        <EventSwiper />
        <NoticeBord/>
      </div>
    </div>
  );
};

export default Home;
