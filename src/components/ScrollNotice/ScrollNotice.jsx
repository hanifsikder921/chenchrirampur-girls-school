import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSchoolInfo } from '../../assets/context/SchoolInfoProvider';

export default function ScrollText() {
  const [isHover, setIsHover] = useState(false);

  const { schoolInfo, isLoading, isError } = useSchoolInfo();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading school info</p>;

  return (
    <div
      className="overflow-hidden whitespace-nowrap w-full mx-auto cursor-pointer py-2 border border-gray-300 bg-white"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <motion.div
        animate={{ x: isHover ? 0 : ['100%', '-100%'] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="inline-block"
      >
        <p className="text-lg font-semibold">
          {schoolInfo?.scrollNotice || 'Welcome to our School!'}
        </p>
      </motion.div>
    </div>
  );
}
