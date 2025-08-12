import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';
import { Outlet } from 'react-router';
import ScrollNotice from '../../components/ScrollNotice/ScrollNotice';

const Home = () => {
  return (
    <div>
      <div >
        <ScrollNotice/>
        <img
          src="https://i.ibb.co.com/Jj3Sw0r1/bangladesh-independence-day-background-on-march-26-vector.jpg"
          className="w-full h-96 object-cover"
          alt="Banner image "
        />
      </div>
    </div>
  );
};

export default Home;
