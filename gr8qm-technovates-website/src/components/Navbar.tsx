import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import ApplicationForm from './ApplicationForm';

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md"
      >
        <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 md:text-2xl hover:text-blue-400">
              Gr8QM
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
                className="hidden md:block bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
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
