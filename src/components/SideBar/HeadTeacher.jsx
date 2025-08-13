import React from 'react';

const HeadTeacher = () => {
  return (
    <div className="flex flex-col text-center shadow ">
      <h2 className="text-lg font-semibold text-white  bg-green-800 text-center">প্রধান শিক্ষক</h2>
      <div className='p-2'>
        <div className="flex justify-center p-4">
          <img src="https://i.ibb.co.com/yB5Y85Qb/head-master.png" alt="" />
        </div>
        <p className="font-semibold">তপন কুমার</p>
        <p>চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়</p>
      </div>
    </div>
  );
};

export default HeadTeacher;
