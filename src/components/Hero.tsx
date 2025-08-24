import { motion } from 'framer-motion';
import { cloudinaryImages } from '../utils/cloudinaryInstance';

const Hero = () => {
  const heroImageURL = cloudinaryImages.verticalLogo.toURL();

  return (
    <motion.div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageURL})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">TRANSFORM YOUR CAREER TODAY</h1>
          <p className="text-lg md:text-xl mt-4">DesignU presents an unrivalled opportunity for you to launch your technology career.</p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
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
    </motion.div>
  );
};

export default Hero;
