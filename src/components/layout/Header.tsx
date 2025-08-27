import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import ApplicationForm from '../ApplicationForm';
import CloudinaryImage from '../../utils/cloudinaryImage';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Trainings', path: '/trainings' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <nav className="bg-gradient-to-r from-light/50 to-skyblue/20 backdrop-blur-sm sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" aria-label="Homepage">
            <CloudinaryImage
              imageKey="verticalLogo"
              className="w-24 hover:scale-105 transition-transform ease-in-out hover:-rotate-2"
              alt="Gr8QM Logo"
            />
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden absolute right-4 top-4 z-50"
          >
            <svg
              className="w-6 h-6 text-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map(({ label, path }) => (
              <Link key={label} to={path} className="text-oxfordblue hover:text-skyblue">
                {label}
              </Link>
            ))}
          </div>
            <button onClick={() => setIsModalOpen(true)} className=" hidden md:block btn-pry">
              Apply Now
            </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-4 px-4"
              role="menu"
              aria-label="Mobile navigation"
            >
              {navLinks.map(({ label, path }, index) => (
                <motion.div
                  key={label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ delay: index * 0.5 }}
                >
                  <Link
                    to={path}
                    className="block text-dark hover:text-skyblue"
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ delay: navLinks.length * 0.5 }}
              >
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-pry w-full"
                  aria-label="Apply Now"
                  role="menuitem"
                  tabIndex={0}
                >
                  Apply Now
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ApplicationForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Header;