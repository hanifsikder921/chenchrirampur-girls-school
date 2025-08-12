import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollText() {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="overflow-hidden whitespace-nowrap rounded-lg w-full  mx-auto cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <motion.div
        animate={{ x: isHover ? 0 : ['0%', '-100%'] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="inline-block"
      >
        <p className="text-lg font-semibold">
          Welcome to Chenchri Rampur Girls High School!
        </p>
      </motion.div>
    </div>
  );
}
