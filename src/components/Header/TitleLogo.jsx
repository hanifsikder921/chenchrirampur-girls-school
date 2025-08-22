import React from 'react';
import logo from '../../../public/logo.png';
import Clock from './Clock';
import Navbar from './Navbar';
import NationalSong from './NationalSong';
import TitleSlider from '../Swiper/TitleSlider';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';
import SchoolInfo from './../../pages/Dashboard/Setting/SchoolInfo';

const TitleLogo = () => {
    const { schoolInfo, isLoading, isError } = useSchoolInfo()

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading school info</p>;
    return (
      <div>
        <div className="bg-[#683091] flex items-center text-white justify-between px-2 py-1 border-b-green-800 border-b-3">
          <h2>{schoolInfo?.schoolName_en}</h2>
          <div className="hidden md:flex">
            <NationalSong />
          </div>
          <div className="hidden md:flex">
            <Clock />
          </div>
        </div>

        <TitleSlider />

        <div>
          <Navbar />
        </div>
      </div>
    );
};


export default TitleLogo;