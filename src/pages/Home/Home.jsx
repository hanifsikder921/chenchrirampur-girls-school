import React from 'react';
import HeadTeacher from '../../components/SideBar/HeadTeacher';

const Home = () => {
    return (
      <div className="grid grid-cols-12 gap-4 w-full my-4">
        <div className="col-span-9 border">
          <img
            src="https://i.ibb.co.com/Jj3Sw0r1/bangladesh-independence-day-background-on-march-26-vector.jpg"
            className='w-full h-96 object-cover'
            alt="Banner image "
          />
        </div>
        <div className="col-span-3 border">
            <HeadTeacher/>
        </div>
      </div>
    );
};

export default Home;