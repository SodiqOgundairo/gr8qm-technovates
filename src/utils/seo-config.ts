/**
 * Centralized SEO Configuration
 * Contains keyword mappings, meta templates, and structured data for all pages
 */

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  type?: string;
  canonical?: string;
}

export const SITE_CONFIG = {
  name: "Gr8QM Technovates",
  tagline: "Tech with purpose, faith, and impact",
  url: "https://gr8qm.com",
  domain: "gr8qm.com",
  email: "hello@gr8qmtechnovates.com",
  phone: "+234 901 329 4248",
  logo: "https://res.cloudinary.com/dmxfjy079/image/upload/v1756125593/Gr8QMTechnovates/Images/svgIcons/Gr8QMLogoIcon_pmqgv0.svg",
  socialMedia: {
    linkedin: "https://www.linkedin.com/company/gr8qm-technovates",
    twitter: "https://www.x.com/gr8qmtechnovate",
    instagram: "https://www.instagram.com/gr8qmtechnovate",
    facebook: "https://web.facebook.com/profile.php?id=61559404115455",
  },
  location: {
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    region: "West Africa",
  },
};

// Primary target keywords for the business
export const PRIMARY_KEYWORDS = [
  "UX design",
  "product design",
  "faith and tech",
  "tech training",
  "UI/UX design services",
  "product design agency",
  "Christian tech company",
  "tech bootcamp",
  "software development training",
  "faith-based innovation",
];

// Long-tail keywords for better conversion
export const LONG_TAIL_KEYWORDS = [
  "UX design services in Nigeria",
  "product design agency Lagos",
  "faith-based tech training",
  "Christian UX designer",
  "sponsored tech bootcamp Nigeria",
  "product design training Lagos",
  "tech training with job placement",
  "kingdom-driven innovation",
  "faith and technology integration",
  "user experience design Nigeria",
];

// Page-specific SEO configurations
export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title: "UX Design, Product Design & Tech Training | Faith-Based Innovation",
    description:
      "Leading UX design, product design, and tech training company in Nigeria. We create AI-powered solutions and train the next generation of tech leaders with faith-based values. Sponsored bootcamp programs available.",
    keywords: [
      "UX design Nigeria",
      "product design services",
      "tech training Lagos",
      "faith-based tech company",
      "UI/UX design agency",
      "tech bootcamp Nigeria",
      "sponsored tech training",
      "Christian innovation",
      "product design agency",
      "software development training",
    ],
    type: "website",
  },
  about: {
    title: "About Us | Faith-Based Tech Innovation Company",
    description:
      "Gr8QM Technovates is a kingdom-rooted innovation collective advancing AI through thoughtful research, purposeful design, and principled development. Learn about our mission to transform lives through technology anchored in faith.",
    keywords: [
      "faith-based tech company",
      "Christian innovation",
      "kingdom-driven technology",
      "tech with purpose",
      "faith and technology",
      "AI research Nigeria",
      "purpose-driven innovation",
    ],
    type: "website",
  },
  services: {
    title: "Our Services | UX Design, Tech Training & Digital Solutions",
    description:
      "Comprehensive tech services including UX/UI design, product design, software development, tech training bootcamps, and print solutions. Faith-based approach to digital transformation and innovation.",
    keywords: [
      "tech services Nigeria",
      "UX design services",
      "product design agency",
      "tech training programs",
      "software development",
      "digital transformation",
      "print services",
    ],
    type: "website",
  },
  designBuild: {
    title: "UX Design & Product Design Services | User Experience Agency",
    description:
      "Expert UX design and product design services in Nigeria. We create stunning, user-centered digital experiences from concept to deployment. Specializing in web apps, mobile apps, and enterprise systems with faith-based excellence.",
    keywords: [
      "UX design services",
      "product design agency",
      "UI/UX design",
      "user experience design",
      "web design Nigeria",
      "mobile app design",
      "user interface design",
      "product design company",
      "digital product design",
      "UX designer Nigeria",
    ],
    type: "service",
  },
  techTraining: {
    title: "Tech Training Programs | Sponsored Bootcamp | Product Design & Development",
    description:
      "Sponsored tech training bootcamp in Nigeria. Learn UX design, product design, frontend/backend development, DevOps, and cybersecurity. Faith-based education with job placement support. Only commitment fee required.",
    keywords: [
      "tech training Nigeria",
      "tech bootcamp Lagos",
      "sponsored tech training",
      "product design training",
      "UX design course",
      "software development bootcamp",
      "frontend development training",
      "backend development course",
      "DevOps training",
      "cybersecurity course",
      "tech training with job placement",
    ],
    type: "service",
  },
  printShop: {
    title: "Print Shop Services | Premium Printing Solutions",
    description:
      "Professional print shop services in Lagos, Nigeria. High-quality printing for business cards, banners, brochures, and more. Excellence and attention to detail in every project.",
    keywords: [
      "print shop Lagos",
      "printing services Nigeria",
      "business card printing",
      "banner printing",
      "brochure printing",
      "professional printing",
    ],
    type: "service",
  },
  trainings: {
    title: "Tech Training Courses | Product Design, Frontend, Backend | Sponsored Programs",
    description:
      "Browse our sponsored tech training courses: Product Design, Product Management, Frontend Development, Backend Development, DevOps, and Cybersecurity. Faith-based education with industry experts and job placement support.",
    keywords: [
      "tech courses Nigeria",
      "product design course",
      "frontend development training",
      "backend development course",
      "DevOps training",
      "cybersecurity course",
      "product management training",
      "sponsored bootcamp",
    ],
    type: "website",
  },
  portfolio: {
    title: "Portfolio | UX Design & Product Design Projects",
    description:
      "Explore our portfolio of successful UX design, product design, and tech training projects. See how we've helped businesses and individuals achieve their goals through faith-driven innovation.",
    keywords: [
      "UX design portfolio",
      "product design projects",
      "design case studies",
      "tech training success stories",
      "student projects",
    ],
    type: "website",
  },
  contact: {
    title: "Contact Us | Get in Touch for UX Design & Tech Training",
    description:
      "Contact Gr8QM Technovates for UX design, product design services, or tech training inquiries. Based in Lagos, Nigeria. Let's discuss how we can help transform your vision into reality.",
    keywords: [
      "contact UX designer",
      "tech training inquiry",
      "product design consultation",
      "Lagos tech company",
    ],
    type: "website",
  },
  cohort4: {
    title: "Cohort 4 Tech Training | Apply Now",
    description:
      "Join Cohort 4 of our sponsored tech training program. Limited spots available for product design, frontend development, backend development, and more. Faith-based education with job placement support.",
    keywords: [
      "tech bootcamp cohort",
      "tech training enrollment",
      "sponsored tech program",
      "bootcamp application",
    ],
    type: "website",
  },
};

// Default fallback SEO
export const DEFAULT_SEO: PageSEO = {
  title: "Gr8QM Technovates | Tech with purpose, faith, and impact",
  description:
    "We design, build, and deliver AI-powered solutions, product design, and training that raise leaders from overlooked spaces. Faith-based tech innovation in Nigeria.",
  keywords: PRIMARY_KEYWORDS,
  type: "website",
};

// Helper function to get SEO config for a page
export const getPageSEO = (pageKey: string): PageSEO => {
  return PAGE_SEO[pageKey] || DEFAULT_SEO;
};

// Helper function to generate full title
export const generateTitle = (pageTitle?: string): string => {
  if (!pageTitle) return SITE_CONFIG.name;
  return `${pageTitle} | ${SITE_CONFIG.name}`;
};

// Helper function to generate canonical URL
export const generateCanonicalURL = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
};
