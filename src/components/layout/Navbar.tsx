import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import ApplicationForm from '../ApplicationForm';
import CloudinaryImage from '../../utils/cloudinaryImage';

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-light/50 backdrop-blur-sm shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
          <div className="flex justify-between items-center">
            <Link to="/" >
              <CloudinaryImage
                imageKey="verticalLogo"
                className="max-w-30 hover:scale-120 hover:-rotate-2"
                alt="About Hero Background"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/" className="text-gray-800 mx-4 hover:text-blue-400">Home</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/about" className="text-gray-800 mx-4 hover:text-blue-400">About</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/trainings" className="text-gray-800 mx-4 hover:text-blue-400">Trainings</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/contact" className="text-gray-800 mx-4 hover:text-blue-400">Contact</Link>
            </motion.div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-pry"
            >
              Apply Now
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ApplicationForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
