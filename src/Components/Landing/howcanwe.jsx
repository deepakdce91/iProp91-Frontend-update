// CircleComponent.js
import React from 'react';
import { motion } from 'framer-motion';

const CircleComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -210 }} // Start above the viewport
      whileInView={{ opacity: 1, y: -900 }} // Move up to cover the top component
      exit={{ opacity: 0, y: -400 }} // Move back down and fade out on exit
      transition={{ duration: 0.9 }}
      className="absolute w-full  flex items-center justify-center bg-black rounded-t-[50%]"
      style={{
        zIndex: 10, // To cover the component above
    
          boxShadow: '0 -100px 100px -100px white', // Apply shadow to the upper corners only
          borderTopLeftRadius: '50%',
          borderTopRightRadius: '50%',
      }}
    >
      <div className="flex flex-col w-full">

        <h2 className="text-white text-center text-7xl font-semibold flex flex-col items-center justify-center h-[900px]">
          <p className='py-2'> How iProp91 does </p><p className='py-2'>  things differently</p>
        </h2>

      </div>
    </motion.div>
  );
};

export default CircleComponent;