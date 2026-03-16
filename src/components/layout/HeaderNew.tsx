import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Modal from "./Modal";
import ApplicationForm from "../ApplicationForm";
import CloudinaryImage from "../../utils/cloudinaryImage";
import Container from "./Container";
import MagneticButton from "../animations/MagneticButton";

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
  { label: "Blog", path: "/blog" },
  { label: "Careers", path: "/careers" },
];

const defaultLogo = {
  imageKey: "verticalLogo",
  alt: "Gr8QM Logo",
  className: "w-20 lg:w-24",
};

const defaultCtaButton: HeaderProps["ctaButton"] = {
  label: "Let's Talk",
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const dropdownButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const location = useLocation();

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (diff > 10 && latest > 100) {
      setIsHidden(true);
    } else if (diff < -5) {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
    lastScrollY.current = latest;
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(null);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const toggleDropdown = (index: number) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const setDropdownRef = (index: number, element: HTMLDivElement | null) => {
    if (element) dropdownRefs.current.set(index, element);
    else dropdownRefs.current.delete(index);
  };

  const setDropdownButtonRef = (index: number, element: HTMLButtonElement | null) => {
    if (element) dropdownButtonRefs.current.set(index, element);
    else dropdownButtonRefs.current.delete(index);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{
          y: isHidden && !isMobileMenuOpen ? -100 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 0.6, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-2 bg-light/80 dark:bg-dark/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,152,218,0.1)]"
            : "py-4 bg-transparent"
        }`}
      >
        <Container className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" aria-label="Homepage" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <CloudinaryImage
                imageKey="verticalLogo"
                className={logo.className}
                alt={logo.alt}
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item, index) =>
              item.path ? (
                <MagneticButton key={item.label} strength={0.15}>
                  <Link
                    to={item.path}
                    className="relative px-4 py-2 group"
                  >
                    <span
                      className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                        isActive(item.path)
                          ? "text-skyblue"
                          : "text-oxford hover:text-skyblue"
                      }`}
                    >
                      {item.label}
                    </span>
                    <motion.span
                      className="absolute bottom-0 left-1/2 h-[2px] bg-skyblue rounded-full"
                      initial={false}
                      animate={{
                        width: isActive(item.path) ? "60%" : "0%",
                        x: "-50%",
                      }}
                      whileHover={{ width: "60%", x: "-50%" }}
                      transition={{ duration: 0.3, ease: [0.22, 0.6, 0.36, 1] }}
                    />
                  </Link>
                </MagneticButton>
              ) : (
                <div key={item.label} className="relative">
                  <MagneticButton strength={0.15}>
                    <button
                      ref={(el) => setDropdownButtonRef(index, el)}
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide text-oxford hover:text-skyblue transition-colors duration-300"
                      aria-expanded={isDropdownOpen === index}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <motion.svg
                        animate={{ rotate: isDropdownOpen === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-3.5 h-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                  </MagneticButton>

                  <AnimatePresence>
                    {isDropdownOpen === index && item.dropdownLinks && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 0.6, 0.36, 1] }}
                        ref={(el) => setDropdownRef(index, el)}
                        className="absolute left-0 mt-1 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-800/50 py-2 overflow-hidden"
                        role="menu"
                      >
                        {item.dropdownLinks.map((dropdownItem, di) => (
                          <motion.div
                            key={dropdownItem.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: di * 0.05 }}
                          >
                            <Link
                              to={dropdownItem.path || "#"}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-oxford hover:bg-skyblue/5 hover:text-skyblue transition-all duration-200 group"
                              onClick={() => setIsDropdownOpen(null)}
                              role="menuitem"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-skyblue/30 group-hover:bg-skyblue group-hover:scale-150 transition-all duration-200" />
                              {dropdownItem.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ),
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <MagneticButton strength={0.2}>
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-oxford text-white text-sm font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-skyblue/20"
                data-cursor="view"
              >
                <span className="relative z-10">{ctaButton.label}</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
                <span className="absolute inset-0 bg-skyblue transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 6 : 0,
              }}
              className="block w-6 h-0.5 bg-oxford origin-center"
            />
            <motion.span
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
                scaleX: isMobileMenuOpen ? 0 : 1,
              }}
              className="block w-6 h-0.5 bg-oxford"
            />
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -6 : 0,
              }}
              className="block w-6 h-0.5 bg-oxford origin-center"
            />
          </button>
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
              animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
              exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
              transition={{ duration: 0.5, ease: [0.22, 0.6, 0.36, 1] }}
              className="md:hidden fixed inset-0 bg-light/98 dark:bg-dark/98 backdrop-blur-2xl z-40 flex flex-col justify-center px-8"
              role="menu"
              aria-label="Mobile navigation"
              id="mobile-menu"
            >
              <div className="space-y-2">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, ease: [0.22, 0.6, 0.36, 1] }}
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`block text-3xl font-bold py-3 transition-colors hover:text-skyblue ${
                          isActive(item.path) ? "text-skyblue" : "text-oxford"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        <span className="text-skyblue/30 text-sm font-mono mr-3">
                          0{index + 1}
                        </span>
                        {item.label}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="flex items-center gap-3 text-3xl font-bold py-3 text-oxford hover:text-skyblue transition-colors w-full"
                          aria-expanded={isDropdownOpen === index}
                        >
                          <span className="text-skyblue/30 text-sm font-mono mr-1">
                            0{index + 1}
                          </span>
                          {item.label}
                          <motion.svg
                            animate={{ rotate: isDropdownOpen === index ? 180 : 0 }}
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>
                        <AnimatePresence>
                          {isDropdownOpen === index && item.dropdownLinks && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-12"
                            >
                              <div className="space-y-1 border-l-2 border-skyblue/30 pl-4 py-2">
                                {item.dropdownLinks.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.label}
                                    to={dropdownItem.path || "#"}
                                    className="block text-lg text-gray-2 hover:text-skyblue transition-colors py-2"
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
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-oxford text-white text-lg font-medium rounded-full"
                >
                  {ctaButton.label} →
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed nav */}
      <div className={stickyHeader ? "h-20" : ""} />

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
