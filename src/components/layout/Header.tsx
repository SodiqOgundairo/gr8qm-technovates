import { useEffect, useRef, useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import ApplicationForm from "../ApplicationForm";
import CloudinaryImage from "../../utils/cloudinaryImage";
import Button from "../common/Button";
import Container from "./Container";

// Link types
interface NavItem {
  label: string;
  path?: string;
  dropdownLinks?: NavItem[];
  onClick?: () => void;
}
interface HeaderProps {
  navLinks?: NavItem[];
  logo?: {
    imageKey: string;
    alt: string;
    className?: string;
  };
  ctaButton?: {
    label: string;
    onClick?: () => void;
  };
  stickyHeader?: boolean;
  showModal?: boolean;
  modalContent?: React.ReactNode;
}

const defaultNavLinks: NavItem[] = [
  { label: "About", path: "/about" },
  {
    label: "Services",
    dropdownLinks: [
      { label: "Design & Build", path: "/services/design-build" },
      { label: "Print Shop", path: "/services/print-shop" },
      { label: "Tech Training", path: "/services/tech-training" },
    ],
  },
  { label: "Portfolio", path: "/portfolio" },
];

const defaultLogo = {
  imageKey: "verticalLogo",
  alt: "Gr8QM Logo",
  className:
    "w-24 hover:scale-105 transition-transform ease-in-out hover:-rotate-2",
};

const defaultCtaButton: HeaderProps["ctaButton"] = {
  label: "Contact Us",
};
const Header: React.FC<HeaderProps> = ({
  navLinks = defaultNavLinks,
  logo = defaultLogo,
  ctaButton = defaultCtaButton,
  stickyHeader = true,
  showModal = true,
  modalContent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const dropdownButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown as any);
    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen !== null) {
        const dropdownRef = dropdownRefs.current.get(isDropdownOpen);
        const buttonRef = dropdownButtonRefs.current.get(isDropdownOpen);

        if (
          dropdownRef &&
          !dropdownRef.contains(event.target as Node) &&
          buttonRef &&
          !buttonRef.contains(event.target as Node)
        ) {
          setIsDropdownOpen(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, [isDropdownOpen]);

  // const handleCtaClick = () => {
  //   if (ctaButton.onClick) {
  //     ctaButton.onClick();
  //   } else if (showModal) {
  //     setIsModalOpen(true);
  //   }
  // };

  const toggleDropdown = (index: number) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const setDropdownRef = (index: number, element: HTMLDivElement | null) => {
    if (element) {
      dropdownRefs.current.set(index, element);
    } else {
      dropdownRefs.current.delete(index);
    }
  };

  const setDropdownButtonRef = (
    index: number,
    element: HTMLButtonElement | null
  ) => {
    if (element) {
      dropdownButtonRefs.current.set(index, element);
    } else {
      dropdownButtonRefs.current.delete(index);
    }
  };

  return (
    <>
      <nav
        className={`bg-light/30 to-skyblue/20 backdrop-blur-xl ${
          stickyHeader ? "sticky top-0" : ""
        } z-50 py-3 transition-all duration-300`}
      >
        <Container className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" aria-label="Homepage">
            <CloudinaryImage
              imageKey="verticalLogo"
              className={logo.className}
              alt={logo.alt}
            />
          </Link>

          {/* Hamburger (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Nav (Hidden on mobile) */}
          <div className="hidden md:flex justify-between space-x-8 lg:space-x-16 items-center">
            {navLinks.map((item, index) =>
              item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative group"
                >
                  <span className="text-oxford hover:text-skyblue transition-colors">
                    {item.label}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-skyblue transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                // Dropdown menu trigger
                <div key={item.label} className="relative group">
                  <button
                    ref={(el) => setDropdownButtonRef(index, el)}
                    onClick={() => toggleDropdown(index)}
                    className="text-oxford hover:text-skyblue flex items-center transition-colors"
                    aria-expanded={isDropdownOpen === index}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`ml-1 h-4 w-4 transform transition-transform ${
                        isDropdownOpen === index ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {/* Dropdown menu content */}
                  <AnimatePresence>
                    {isDropdownOpen === index && item.dropdownLinks && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        ref={(el) => setDropdownRef(index, el)}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                      >
                        {item.dropdownLinks.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            to={dropdownItem.path || "#"}
                            className="block px-4 py-2 text-sm text-oxford hover:bg-iceblue/50 hover:text-skyblue transition-colors"
                            onClick={() => setIsDropdownOpen(null)}
                            role="menuitem"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>
          <Button
            to="/contact"
            variant="pry"
            className="hidden md:flex"
            aria-label={ctaButton.label}
          >
            {ctaButton.label}
          </Button>
        </Container>

        {/* Mobile Menu (Hidden on desktop) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-5 px-4 overflow-hidden bg-white/95 backdrop-blur-md shadow-lg rounded-b-xl pb-6"
              role="menu"
              aria-label="Mobile navigation"
              id="mobile-menu"
            >
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="block text-dark hover:text-skyblue transition-colors py-2 border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // Mobile dropdown
                    <div>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="flex justify-between items-center w-full text-left text-dark hover:text-skyblue transition-colors py-2 border-b border-gray-100"
                        aria-expanded={isDropdownOpen === index}
                      >
                        {item.label}
                        <svg
                          className={`h-4 w-4 transform transition-transform ${
                            isDropdownOpen === index ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isDropdownOpen === index && item.dropdownLinks && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-2 pl-4 border-l-2 border-skyblue ml-2">
                              {item.dropdownLinks.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.label}
                                  to={dropdownItem.path || "#"}
                                  className="block text-sm text-dark hover:text-skyblue transition-colors py-1"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsDropdownOpen(null);
                                  }}
                                  role="menuitem"
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-4"
              >
                <Button
                  to="/contact"
                  variant="pry"
                  className="w-full justify-center"
                  aria-label={ctaButton.label}
                >
                  {ctaButton.label}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modal */}
      {showModal && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent || (
            <ApplicationForm onClose={() => setIsModalOpen(false)} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Header;
