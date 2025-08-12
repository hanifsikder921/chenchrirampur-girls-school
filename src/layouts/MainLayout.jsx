import React from 'react';
import { Outlet } from 'react-router';
import TitleLogo from '../components/Header/TitleLogo';
import Home from '../pages/Home/Home';
import HeadTeacher from '../components/SideBar/HeadTeacher';
import RightAside from '../components/SideBar/RightAside';


const MainLayout = () => {
    return (
      <div className="max-w-7xl mx-auto px-4">
   
        <header>
          <TitleLogo />
        </header>

        <main>
          <div className="grid grid-cols-12 gap-4 w-full my-4">
            <div className="col-span-9 ">
              <div>
                <Outlet />
              </div>
            </div>
            <div className="col-span-3 border">
              <RightAside />
            </div>
          </div>
        </main>
      </div>
    );
};

export default MainLayout;