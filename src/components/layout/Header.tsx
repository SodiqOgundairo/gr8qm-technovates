import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import ApplicationForm from '../ApplicationForm';
import CloudinaryImage from '../../utils/cloudinaryImage';

// link types
interface NavItem {
  label: string;
  path?: string;
  dropdownLinks?: NavItem[];
}

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTrainingsDropdownOpen, setIsTrainingsDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks: NavItem[] = [
    { label: 'About', path: '/about' },
    {
      label: 'Services',
      dropdownLinks: [
        { label: 'Services 1', path: '/service/service1' },
        { label: 'Services 2', path: '/service/service2' },
        { label: 'Services 3', path: '/service/service3' },
      ],
    },
    { label: 'Portfolio', path: '/portfolio' },
  ];

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsTrainingsDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsTrainingsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-light/30 to-skyblue/20 backdrop-blur-xl sticky top-0 z-50 px-5 md:px-24 py-3">
        <div className="mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" aria-label="Homepage">
            <CloudinaryImage
              imageKey="verticalLogo"
              className="w-24 hover:scale-105 transition-transform ease-in-out hover:-rotate-2"
              alt="Gr8QM Logo"
            />
          </Link>

          {/* Hamburger (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden absolute right-4 top-4 z-50"
          >
            <svg
              className="w-6 h-6 text-gray-1"
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

          {/* Desktop Nav (Hidden on mobile) */}
          <div className="hidden md:flex justify-between space-x-24 items-center">
            {navLinks.map((item) => (
              item.path ? (
                <Link key={item.label} to={item.path} className="text-oxfordblue hover:text-skyblue">
                  {item.label}
                </Link>
              ) : (
                // Dropdown menu trigger for 'Trainings'
                <div key={item.label} className="relative">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setIsTrainingsDropdownOpen(!isTrainingsDropdownOpen)}
                    className="text-oxfordblue hover:text-skyblue flex items-center"
                    aria-expanded={isTrainingsDropdownOpen}
                  >
                    {item.label}
                    <svg className={`ml-1 h-4 w-4 transform transition-transform ${isTrainingsDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown menu content */}
                  {isTrainingsDropdownOpen && item.dropdownLinks && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {item.dropdownLinks.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          to={dropdownItem.path || '#'}
                          className="block px-4 py-2 text-sm text-oxfordblue hover:bg-iceblue/50 hover:text-skyblue"
                          onClick={() => setIsTrainingsDropdownOpen(false)} // Close dropdown on link click
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
            <button onClick={() => setIsModalOpen(true)} className="btn-pry hidden md:flex">
              Contact Us
            </button>
        </div>

        {/* Mobile Menu (Hidden on desktop) */}
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
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ delay: index * 0.05 }} // Adjusted delay for better flow
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="block text-dark hover:text-skyblue"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // Mobile dropdown for 'Trainings'
                    <div>
                      <button
                        onClick={() => setIsTrainingsDropdownOpen(!isTrainingsDropdownOpen)}
                        className="flex justify-between items-center w-full text-left text-dark hover:text-skyblue"
                      >
                        {item.label}
                        <svg className={`h-4 w-4 transform transition-transform ${isTrainingsDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isTrainingsDropdownOpen && item.dropdownLinks && (
                        <div className="mt-2 space-y-2 pl-4 border-l border-skyblue">
                          {item.dropdownLinks.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.path || '#'}
                              className="block text-sm text-dark hover:text-skyblue"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsTrainingsDropdownOpen(false);
                              }}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
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
                  Contact Us
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
