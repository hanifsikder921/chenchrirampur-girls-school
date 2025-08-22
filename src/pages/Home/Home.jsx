import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';
import { Outlet } from 'react-router';
import ScrollNotice from '../../components/ScrollNotice/ScrollNotice';
import EventSwiper from '../../components/Swiper/EventSwiper';
import NoticeBord from '../../components/NoticeBord/NoticeBord';
import VideoGallery from './../../components/Video/VideoGallery';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import ImportentMenu from '../../components/ImportantMenu/ImportentMenu';
import SchoolMap from '../../components/SchoolMap/SchoolMap';


const Home = () => {
  return (
    <div >
      <div>
        <ScrollNotice />
        <EventSwiper />
        <NoticeBord/>
        <VideoGallery />
        <ImageGallery/>
        <ImportentMenu/>
       <div className='h-5'></div>
        <SchoolMap/>
      </div>
    </div>
  );
};

export default Home;
