import React from 'react';
import cld from '../utils/cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const heroImage = cld.image('Gr8QMTechnovates/image_1_a25x7u');

  return (
    <div className="relative h-screen">
      <AdvancedImage cldImg={heroImage} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">TRANSFORM YOUR CAREER TODAY</h1>
          <p className="text-lg md:text-xl mt-4">DesignU presents an unrivalled opportunity for you to launch your technology career.</p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8"
          >
            <a href="/tech-school" className="bg-blue-500 text-white rounded-md px-6 py-3 mx-2 hover:bg-blue-600">
              Go to Tech School
            </a>
            <a href="/designu-online" className="bg-white text-blue-500 rounded-md px-6 py-3 mx-2 hover:bg-gray-200">
              DesignU Online
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
