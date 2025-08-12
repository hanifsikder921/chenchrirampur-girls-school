import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); 

    return () => clearInterval(timer); 
  }, []);

  return (
    <div className='flex items-center gap-4'>
      <p>{dateTime.toLocaleDateString()}</p>
      <p>{dateTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default Clock;
