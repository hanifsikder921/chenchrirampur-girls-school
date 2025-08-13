import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';
import { Outlet } from 'react-router';
import ScrollNotice from '../../components/ScrollNotice/ScrollNotice';
import EventSwiper from '../../components/Swiper/EventSwiper';
import NoticeBord from '../../components/NoticeBord/NoticeBord';
import VideoGallery from './../../components/Video/VideoGallery';

const Home = () => {
  return (
    <div >
      <div>
        <ScrollNotice />
        <EventSwiper />
        <NoticeBord/>
        <VideoGallery />
      </div>
    </div>
  );
};

export default Home;
