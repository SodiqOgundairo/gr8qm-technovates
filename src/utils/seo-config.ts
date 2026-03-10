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
  // Core services
  "UX design agency Lagos",
  "product design Nigeria",
  "tech training Lagos",
  "UI/UX design services Nigeria",
  "product design agency",
  "web development company Lagos",
  "tech bootcamp Nigeria",
  "software development training",
  "digital agency Lagos",
  "print shop Lagos",
  "branding agency Nigeria",
  "mobile app development Lagos",
  // Industry & market terms
  "design thinking Nigeria",
  "digital transformation Lagos",
  "startup design partner Nigeria",
  "SaaS product design Lagos",
  "fintech design agency Nigeria",
  "edtech development Lagos",
  "healthtech UI design Nigeria",
  "ecommerce website development Lagos",
  "React developer Lagos",
  "fullstack developer Nigeria",
  // Education & training
  "learn UI UX design Lagos",
  "coding bootcamp Nigeria",
  "tech academy Lagos",
  "software engineering training Nigeria",
  "graphic design training Lagos",
  "digital skills training Nigeria",
  "IT training institute Lagos",
  // Print & branding
  "corporate branding Lagos",
  "business card design Nigeria",
  "packaging design Lagos",
  "brand identity agency Nigeria",
  "flyer design and printing Lagos",
];

// Long-tail keywords for better conversion
export const LONG_TAIL_KEYWORDS = [
  "best UX design agency in Lagos Nigeria",
  "product design agency in Lagos",
  "sponsored tech bootcamp in Nigeria",
  "product design training Lagos Nigeria",
  "tech training with job placement Nigeria",
  "web development company in Lagos",
  "affordable tech training programs Lagos",
  "print and branding services Lagos",
  "UI UX design company Nigeria",
  "frontend development training Lagos",
  "best digital agency in Nigeria",
  "mobile app designers Lagos",
  // Intent-based queries
  "how to learn product design in Lagos",
  "where to learn coding in Nigeria",
  "best tech training program in Lagos 2026",
  "hire UX designer in Lagos Nigeria",
  "hire web developer Lagos",
  "affordable website design Lagos Nigeria",
  "best print shop near me Lagos",
  "tech bootcamp with job placement Nigeria",
  "free tech training in Nigeria 2026",
  "sponsored coding bootcamp Lagos",
  "learn frontend development in Lagos",
  "learn backend development in Nigeria",
  "DevOps training program Lagos Nigeria",
  "cybersecurity course Lagos Nigeria",
  // Niche & vertical keywords
  "faith-based tech company Nigeria",
  "Christian tech training Lagos",
  "purpose-driven design agency Nigeria",
  "social impact tech company Lagos",
  "MVP development agency Lagos Nigeria",
  "prototype design agency Nigeria",
  "Figma design agency Lagos",
  "wireframe to deployment Lagos",
  "custom web application development Nigeria",
  "responsive website design Lagos",
  "mobile-first design agency Nigeria",
  "API development company Lagos",
  "landing page design Lagos Nigeria",
  "conversion-focused design agency Nigeria",
];

// Geo-targeted keyword variations
export const GEO_KEYWORDS = [
  // Lagos neighborhoods & areas
  "tech company Lekki Lagos",
  "design agency Victoria Island",
  "tech training Ikeja Lagos",
  "web developer Yaba Lagos",
  "IT training Surulere Lagos",
  "design studio Ikoyi Lagos",
  // Other Nigerian cities (service reach)
  "tech training Abuja Nigeria",
  "web development company Abuja",
  "UX design agency Port Harcourt",
  "digital agency Ibadan Nigeria",
  "tech bootcamp Abuja",
  "software development Kano Nigeria",
  // Regional & country-level
  "best tech agency West Africa",
  "design agency Africa",
  "tech training sub-Saharan Africa",
  "Nigerian tech company",
  "Lagos tech startup ecosystem",
  "Nigeria digital skills gap",
];

// Page-specific SEO configurations
export const PAGE_SEO: Record<string, PageSEO> = {
  home: {
    title:
      "UX Design, Web Development & Tech Training Agency in Lagos, Nigeria",
    description:
      "Gr8QM Technovates is a leading design and technology studio in Lagos, Nigeria. We build digital products, deliver premium print services, and train the next generation of tech talent through sponsored bootcamp programs. From startups to enterprises — get a free consultation today.",
    keywords: [
      "UX design agency Lagos",
      "product design Nigeria",
      "tech training Lagos",
      "web development company Nigeria",
      "UI/UX design agency Lagos",
      "tech bootcamp Nigeria",
      "sponsored tech training Lagos",
      "digital agency Nigeria",
      "product design agency Lagos",
      "software development training Nigeria",
      "mobile app development Lagos",
      "branding and print Lagos",
      "digital transformation Lagos",
      "startup design partner Nigeria",
      "React development agency Lagos",
      "fullstack development company Nigeria",
      "SaaS product design Lagos",
      "fintech design Lagos",
      "ecommerce development Lagos Nigeria",
      "hire UX designer Lagos",
      "best tech company Lagos",
      "Nigerian design studio",
      "faith-based tech company Nigeria",
    ],
    type: "website",
  },
  about: {
    title: "About Gr8QM Technovates | Design & Technology Studio Lagos",
    description:
      "Gr8QM Technovates is a purpose-driven design and technology studio in Lagos, Nigeria. We craft digital products, train tech talent through sponsored bootcamps, and deliver premium print. Learn about our mission, values, and the team behind the work.",
    keywords: [
      "design studio Lagos",
      "tech company Nigeria",
      "about Gr8QM Technovates",
      "digital agency Lagos Nigeria",
      "tech training company",
      "product design studio",
      "purpose-driven design agency",
      "faith-based tech company Lagos",
      "social impact tech Nigeria",
      "Nigerian tech startup",
      "Lagos tech ecosystem",
      "tech innovation company Nigeria",
      "design thinking Lagos",
    ],
    type: "website",
  },
  services: {
    title: "Our Services | Design, Print & Tech Training in Lagos, Nigeria",
    description:
      "Comprehensive tech services in Lagos, Nigeria: web & mobile development, UX/UI design, premium printing, branding, and sponsored tech training bootcamps. From MVPs to enterprise solutions — Gr8QM delivers.",
    keywords: [
      "tech services Lagos Nigeria",
      "UX design services Lagos",
      "product design agency Nigeria",
      "tech training programs Lagos",
      "web development Lagos",
      "print services Lagos Nigeria",
      "digital agency services",
      "MVP development Lagos",
      "mobile app design Nigeria",
      "brand identity Lagos",
      "corporate branding Nigeria",
      "fullstack development Lagos",
      "API development Nigeria",
      "responsive web design Lagos",
      "custom software Lagos Nigeria",
    ],
    type: "website",
  },
  designBuild: {
    title:
      "Web Development & UX Design Services in Lagos | Gr8QM Technovates",
    description:
      "Custom web and mobile app development, UI/UX design, and full-stack engineering in Lagos, Nigeria. We build SaaS platforms, fintech products, ecommerce stores, and enterprise solutions. From wireframe to deployment — get a free consultation today.",
    keywords: [
      "web development Lagos",
      "UX design services Lagos",
      "product design agency Nigeria",
      "UI/UX design Lagos",
      "mobile app development Nigeria",
      "web design company Lagos",
      "custom software development",
      "product design company Nigeria",
      "digital product design Lagos",
      "UX designer Lagos Nigeria",
      "React developer Lagos",
      "Next.js development Nigeria",
      "TypeScript developer Lagos",
      "Node.js development Nigeria",
      "SaaS development Lagos",
      "fintech development Nigeria",
      "ecommerce website Lagos",
      "progressive web app Nigeria",
      "Figma to code Lagos",
      "wireframe to deployment Nigeria",
      "MVP development agency Lagos",
      "prototype design Lagos",
      "user research Nigeria",
      "usability testing Lagos",
      "conversion rate optimization Nigeria",
      "landing page design Lagos",
      "responsive design Lagos Nigeria",
    ],
    type: "service",
  },
  techTraining: {
    title:
      "Tech Training & Bootcamp in Lagos, Nigeria | Sponsored Programs 2026",
    description:
      "Sponsored tech training bootcamp in Lagos, Nigeria. Learn UX design, product design, product management, frontend/backend development, DevOps, and cybersecurity. Only a commitment fee required. Industry mentors, real projects, and job placement support included.",
    keywords: [
      "tech training Lagos Nigeria",
      "tech bootcamp Lagos",
      "sponsored tech training Nigeria",
      "product design training Lagos",
      "UX design course Lagos",
      "software development bootcamp Nigeria",
      "frontend development training Lagos",
      "backend development course Nigeria",
      "DevOps training Lagos",
      "cybersecurity course Nigeria",
      "tech training with job placement Lagos",
      "affordable coding bootcamp Nigeria",
      "learn to code Lagos",
      "coding school Nigeria",
      "software engineering bootcamp Lagos",
      "product management course Nigeria",
      "Figma training Lagos",
      "React training Nigeria",
      "Python training Lagos",
      "JavaScript bootcamp Nigeria",
      "tech career change Lagos",
      "entry level tech training Nigeria",
      "beginner coding course Lagos",
      "tech scholarship Nigeria 2026",
      "free tech training Lagos",
      "IT training institute Lagos",
      "digital skills program Nigeria",
      "tech apprenticeship Lagos",
    ],
    type: "service",
  },
  printShop: {
    title: "Print Shop & Branding Services in Lagos, Nigeria | Gr8QM",
    description:
      "Premium print shop and branding services in Lagos, Nigeria. Business cards, banners, brochures, branded merchandise, custom packaging, large format printing, and complete brand identity design. Fast turnaround, quality guaranteed, affordable prices.",
    keywords: [
      "print shop Lagos Nigeria",
      "printing services Lagos",
      "business card printing Lagos",
      "banner printing Nigeria",
      "brochure printing Lagos",
      "branded merchandise Lagos",
      "custom packaging Nigeria",
      "branding services Lagos",
      "flyer printing Lagos",
      "corporate stationery Nigeria",
      "large format printing Lagos",
      "t-shirt printing Nigeria",
      "label printing Lagos",
      "brand identity design Nigeria",
      "logo design Lagos",
      "signage printing Nigeria",
      "event branding Lagos",
      "promotional materials Nigeria",
      "print and design Lagos",
      "affordable printing Lagos Nigeria",
    ],
    type: "service",
  },
  trainings: {
    title:
      "Tech Training Courses | Product Design, Frontend, Backend, DevOps | Sponsored Programs",
    description:
      "Browse our sponsored tech training courses: Product Design, Product Management, Frontend Development, Backend Development, DevOps, and Cybersecurity. Industry-experienced instructors, real-world projects, and job placement support. Apply now for 2026.",
    keywords: [
      "tech courses Nigeria",
      "product design course Lagos",
      "frontend development training Nigeria",
      "backend development course Lagos",
      "DevOps training Nigeria",
      "cybersecurity course Lagos",
      "product management training Nigeria",
      "sponsored bootcamp Lagos",
      "UX design course Nigeria",
      "software development course Lagos",
      "coding courses Nigeria",
      "tech certification Lagos",
      "professional development Nigeria",
      "career bootcamp Lagos",
      "hands-on tech training Nigeria",
    ],
    type: "website",
  },
  portfolio: {
    title:
      "Portfolio | UX Design & Web Development Projects | Gr8QM Technovates",
    description:
      "Explore our portfolio of UX design, product design, web development, and mobile app projects. See real case studies of how we've helped startups, SMEs, and enterprises build impactful digital products in Lagos, Nigeria.",
    keywords: [
      "UX design portfolio Lagos",
      "product design projects Nigeria",
      "design case studies Lagos",
      "tech training success stories",
      "web development portfolio Nigeria",
      "mobile app portfolio Lagos",
      "student projects Nigeria",
      "SaaS design case study",
      "fintech project Lagos",
      "ecommerce project Nigeria",
      "Nigerian design portfolio",
      "client work Lagos",
    ],
    type: "website",
  },
  contact: {
    title: "Contact Gr8QM Technovates | Design & Tech Agency Lagos, Nigeria",
    description:
      "Get in touch with Gr8QM Technovates for web development, UX design, printing, branding, or tech training inquiries. Based in Lagos, Nigeria. Free consultations available. Call, email, or visit us today.",
    keywords: [
      "contact Gr8QM Technovates",
      "design agency Lagos contact",
      "tech training inquiry Lagos",
      "web development consultation Nigeria",
      "Lagos tech company contact",
      "hire designer Lagos",
      "hire developer Nigeria",
      "free consultation Lagos",
      "tech agency phone number Lagos",
      "design agency email Nigeria",
    ],
    type: "website",
  },
  careers: {
    title: "Careers at Gr8QM Technovates | Join Our Team in Lagos, Nigeria",
    description:
      "Join Gr8QM Technovates — a purpose-driven tech company in Lagos, Nigeria. We're hiring designers, developers, and trainers. Explore open positions and build your career with us.",
    keywords: [
      "tech jobs Lagos Nigeria",
      "UX designer jobs Lagos",
      "web developer jobs Nigeria",
      "design agency careers Lagos",
      "tech company jobs Nigeria",
      "frontend developer jobs Lagos",
      "backend developer jobs Nigeria",
      "remote tech jobs Nigeria",
      "junior developer jobs Lagos",
      "internship tech Lagos",
    ],
    type: "website",
  },
  cohort4: {
    title:
      "Cohort 4 Tech Training | Apply Now for 2026 | Gr8QM Technovates Lagos",
    description:
      "Join Cohort 4 of our sponsored tech training program in Lagos, Nigeria. Limited spots for product design, product management, frontend development, backend development, DevOps, and cybersecurity. Only a commitment fee — apply before slots fill up.",
    keywords: [
      "tech bootcamp cohort 2026",
      "tech training enrollment Lagos",
      "sponsored tech program Nigeria",
      "bootcamp application Lagos",
      "Gr8QM cohort 4",
      "tech training apply now Nigeria",
      "coding bootcamp registration Lagos",
      "product design cohort Nigeria",
      "developer bootcamp Lagos 2026",
      "free tech training application Nigeria",
    ],
    type: "website",
  },
  blog: {
    title: "Blog | Tech, Design & Innovation Insights | Gr8QM Technovates",
    description:
      "Read articles on UX design, web development, tech training, product management, and digital innovation from the Gr8QM Technovates team in Lagos, Nigeria.",
    keywords: [
      "tech blog Nigeria",
      "UX design articles Lagos",
      "web development blog Nigeria",
      "product design insights",
      "tech training tips Lagos",
      "coding tutorials Nigeria",
      "design thinking articles",
      "Nigerian tech blog",
      "startup tips Lagos",
      "digital innovation Nigeria",
    ],
    type: "website",
  },
};

// Default fallback SEO
export const DEFAULT_SEO: PageSEO = {
  title: "Gr8QM Technovates | Design, Tech & Training Agency in Lagos, Nigeria",
  description:
    "Gr8QM Technovates is a design and technology studio in Lagos, Nigeria. We build digital products, deliver premium print, and run sponsored tech training programs.",
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
