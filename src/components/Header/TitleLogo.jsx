import React from 'react';
import logo from '../../../public/logo.png';
import Clock from './Clock';
import Navbar from './Navbar';

const TitleLogo = () => {
    return (
      <div>
        <div className="bg-[#683091] flex items-center text-white justify-between px-2 py-1 border-b-lime-500 border-b-3">
          <h2>Chenchri Rampur Girls High School</h2>
          <div>
            <Clock />
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-gray-100 p-12 place-items-center place-content-center">
          <img src={logo} className="w-20 h-20" alt="Logo" />
          <h1 className="text-2xl font-bold text-black">চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়</h1>
        </div>

        <div>
          <Navbar />
        </div>
      </div>
    );
};


export default TitleLogo;