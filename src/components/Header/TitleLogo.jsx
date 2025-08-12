import React from 'react';
import logo from '../../../public/logo.png';
import Clock from './Clock';
import Navbar from './Navbar';
import NationalSong from './NationalSong';
import TitleSlider from '../Swiper/TitleSlider';

const TitleLogo = () => {
    return (
      <div>
        <div className="bg-[#683091] flex items-center text-white justify-between px-2 py-1 border-b-lime-500 border-b-3">
          <h2>Chenchri Rampur Girls High School</h2>
          <div>
            <NationalSong />
          </div>
          <div>
            <Clock />
          </div>
        </div>
      

        <TitleSlider/>

        <div>
          <Navbar />
        </div>
      </div>
    );
};


export default TitleLogo;