import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';
import { Outlet } from 'react-router';
import ScrollNotice from '../../components/ScrollNotice/ScrollNotice';
import EventSwiper from '../../components/Swiper/EventSwiper';

const Home = () => {
  return (
    <div >
      <div>
        <ScrollNotice />
        <EventSwiper />
      </div>
    </div>
  );
};

export default Home;
