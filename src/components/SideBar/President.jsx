import React from 'react';

const President = () => {
  return (
    <div className="flex flex-col text-center shadow ">
      <h2 className="text-lg font-semibold text-white  bg-green-800 text-center">সভাপতি</h2>
      <div className='p-2'>
        <div className="flex justify-center p-4">
          <img src="https://i.ibb.co.com/7JxPPfRv/aminulislam.jpg" alt="" />
        </div>
        <p className="font-semibold">আমিনুল ইসলাম খান</p>
        <p>চেঁচরীরামপুর বালিকা মাধ্যমিক বিদ্যালয়</p>
      </div>
    </div>
  );
};

export default President;
