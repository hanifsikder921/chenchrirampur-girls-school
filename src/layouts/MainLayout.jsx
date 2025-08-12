import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Header/Navbar';
import TitleLogo from '../components/Header/TitleLogo';
import Home from '../pages/Home/Home';



const MainLayout = () => {
    return (
        <div className='max-w-7xl mx-auto px-4'>
{/* 
            <header>
               <Navbar></Navbar>
            </header> */}

            <header>
                <TitleLogo />
            </header>

            <main>
               <Home/> 
            </main>


            {/* <main>
                <section>
                    <Outlet></Outlet>
                </section>

            </main> */}






        </div>
    );
};

export default MainLayout;