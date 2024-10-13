// CircleComponent.js
import React from 'react';
import { motion } from 'framer-motion';

const CircleComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }} // Start above the viewport
      whileInView={{ opacity: 1, y: -900 }} // Move up to cover the top component
      exit={{ opacity: 0, y: -400 }} // Move back down and fade out on exit
      transition={{ duration: 0.6 }}
      className="absolute w-full h-screen flex items-center justify-center bg-black rounded-t-[50%]"
      style={{
        zIndex: 10, // To cover the component above
        boxShadow: '0 -20px 500px -10px white', // Increased blur and spread radius
      }}
    >
      <h2 className="text-white text-center text-xl font-semibold">
        How Dezerv does <br /> things differently
      </h2>
    </motion.div>
  );
};

export default CircleComponent;
