import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
      {/* Animated logo/icon */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-white"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Loading text with staggered animation */}
      <motion.div className="mt-6 flex space-x-1">
        {['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((char, index) => (
          <motion.span
            key={index}
            className="text-gray-700 text-xl font-medium"
            animate={{
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Progress bar */}
      <motion.div className="mt-8 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;
