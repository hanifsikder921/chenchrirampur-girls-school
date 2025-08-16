import React from 'react';
import { Outlet } from 'react-router';
import TitleLogo from '../components/Header/TitleLogo';
import Home from '../pages/Home/Home';
import HeadTeacher from '../components/SideBar/HeadTeacher';
import RightAside from '../components/SideBar/RightAside';
import Footer from '../components/Footer/Footer';


const MainLayout = () => {
    return (
      <div className="max-w-6xl mx-auto px-4  bg-gray-100">
   
        <header>
          <TitleLogo />
        </header>

        <main>
          <div className="grid  grid-cols-12 gap-4 w-full mb-4">
            <div className="md:col-span-9 col-span-12 ">
              <div>
                <Outlet />
              </div>
            </div>
            <div className="md:col-span-3 col-span-12">
              <RightAside />
            </div>
          </div>
        </main>

        <Footer/>
      </div>
    );
};

export default MainLayout;