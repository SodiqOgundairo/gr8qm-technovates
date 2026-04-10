import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "./Container";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { Button } from "devign";

const navLinks = [
  { label: "About", path: "/about" },
  {
    label: "Services",
    children: [
      { label: "Design & Build", path: "/services/design-build" },
      { label: "Print Shop", path: "/services/print-shop" },
      { label: "Tech Training", path: "/services/tech-training" },
    ],
  },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Blog", path: "/blog" },
  { label: "Careers", path: "/careers" },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastY.current;
    if (diff > 10 && y > 100) setHidden(true);
    else if (diff < -5) setHidden(false);
    setScrolled(y > 50);
    lastY.current = y;
  });

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDropdownOpen(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownOpen !== null && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [dropdownOpen]);

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "py-3 backdrop-blur-xl bg-oxford-deep/90 shadow-[0_1px_0_rgba(0,152,218,0.08)]"
            : "py-5 bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Container className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" aria-label="Gr8QM homepage" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
            >
              <CloudinaryImage
                imageKey="verticalLogoInvert"
                className="w-20 lg:w-24"
                alt="Gr8QM Technovates"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav — minimal, spaced */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item, i) =>
              item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 ${
                      isActive(item.path) ? "text-skyblue" : "text-iceblue/70 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-skyblue"
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ) : (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === i ? null : i)}
                    className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium tracking-wide uppercase text-iceblue/70 hover:text-white transition-colors duration-300"
                    aria-expanded={dropdownOpen === i}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <motion.svg
                      animate={{ rotate: dropdownOpen === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-3 h-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen === i && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number] }}
                        className="absolute left-0 mt-2 w-52 rounded-xl overflow-hidden border border-oxford-border bg-oxford-card/95 backdrop-blur-xl shadow-2xl"
                        role="menu"
                      >
                        {item.children.map((child, ci) => (
                          <motion.div
                            key={child.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ci * 0.04 }}
                          >
                            <Link
                              to={child.path}
                              onClick={() => setDropdownOpen(null)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-iceblue/70 hover:text-white hover:bg-skyblue/5 transition-all duration-200 group"
                              role="menuitem"
                            >
                              <span className="w-1 h-1 rounded-full bg-skyblue/30 group-hover:bg-skyblue group-hover:scale-150 transition-all duration-200" />
                              {child.label}
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

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full overflow-hidden border border-iceblue/20 text-white hover:border-skyblue/40 transition-all duration-300"
            >
              <span className="relative z-10">Let's Talk</span>
              <motion.span
                className="relative z-10 text-skyblue"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                →
              </motion.span>
              <span className="absolute inset-0 bg-skyblue/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)]" />
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0, backgroundColor: mobileOpen ? "#0098da" : "#c9ebfb" }}
              className="block w-6 h-0.5 origin-center"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
              className="block w-6 h-0.5 bg-iceblue"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0, backgroundColor: mobileOpen ? "#0098da" : "#c9ebfb" }}
              className="block w-6 h-0.5 origin-center"
            />
          </button>
        </Container>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] bg-oxford-deep/98 backdrop-blur-2xl flex flex-col justify-center px-8 lg:hidden"
            role="menu"
            aria-label="Mobile navigation"
          >
            {/* Geometric decoration */}
            <div className="absolute top-20 right-8 w-32 h-32 border border-skyblue/10 rounded-full" aria-hidden="true" />
            <div className="absolute bottom-20 left-8 w-20 h-20 border border-orange/10 rotate-45" aria-hidden="true" />

            <div className="space-y-1">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number] }}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-baseline gap-4 py-3 transition-colors ${
                        isActive(item.path) ? "text-skyblue" : "text-white hover:text-skyblue"
                      }`}
                      role="menuitem"
                    >
                      <span className="text-skyblue/30 text-xs font-mono w-6">0{i + 1}</span>
                      <span className="text-3xl font-black tracking-tight">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === i ? null : i)}
                        className="flex items-baseline gap-4 py-3 text-white hover:text-skyblue transition-colors w-full"
                        aria-expanded={dropdownOpen === i}
                      >
                        <span className="text-skyblue/30 text-xs font-mono w-6">0{i + 1}</span>
                        <span className="text-3xl font-black tracking-tight">{item.label}</span>
                        <motion.svg animate={{ rotate: dropdownOpen === i ? 180 : 0 }} className="w-4 h-4 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {dropdownOpen === i && item.children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-10"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                to={child.path}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-lg text-iceblue/60 hover:text-skyblue transition-colors"
                                role="menuitem"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Button variant="primary" size="lg" className="w-full" onClick={() => { setMobileOpen(false); navigate("/contact"); }}>
                Let's Talk →
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
