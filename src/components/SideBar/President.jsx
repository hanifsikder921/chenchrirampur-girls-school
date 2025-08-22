import React from 'react';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

const President = () => {
    const { schoolInfo, isLoading, isError } = useSchoolInfo();
  
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading school info</p>;
  return (
    <div className="flex flex-col text-center shadow ">
      <h2 className="text-lg font-semibold text-white  bg-green-800 text-center">সভাপতি</h2>
      <div className='p-2'>
        <div className="flex justify-center p-4">
          <img src={schoolInfo?.precidentPhoto} alt="" />
        </div>
        <p className="font-semibold">{schoolInfo?.precident}</p>
        <p>{schoolInfo?.schoolName_bn}</p>
      </div>
    </div>
  );
};

export default President;
