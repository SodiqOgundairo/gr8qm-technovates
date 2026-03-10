/**
 * Structured Data (Schema.org) Utilities
 * Type-safe helpers for generating JSON-LD markup
 */

import { SITE_CONFIG } from "./seo-config";

// Schema.org type definitions
export interface Organization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: ContactPoint;
  address?: PostalAddress;
}

export interface ContactPoint {
  "@type": string;
  telephone: string;
  contactType: string;
  email?: string;
  availableLanguage?: string[];
}

export interface PostalAddress {
  "@type": string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
}

export interface WebSite {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction?: SearchAction;
}

export interface SearchAction {
  "@type": string;
  target: string;
  "query-input": string;
}

export interface Course {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: Organization;
  offers?: Offer;
  hasCourseInstance?: CourseInstance[];
}

export interface CourseInstance {
  "@type": string;
  courseMode: string;
  duration: string;
  instructor?: Person;
}

export interface Offer {
  "@type": string;
  price: string;
  priceCurrency: string;
  availability?: string;
  validFrom?: string;
}

export interface Person {
  "@type": string;
  name: string;
  jobTitle?: string;
  image?: string;
}

export interface FAQPage {
  "@context": string;
  "@type": string;
  mainEntity: Question[];
}

export interface Question {
  "@type": string;
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  "@type": string;
  text: string;
}

export interface Service {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: Organization;
  areaServed?: string;
  serviceType?: string;
}

export interface BreadcrumbList {
  "@context": string;
  "@type": string;
  itemListElement: ListItem[];
}

export interface ListItem {
  "@type": string;
  position: number;
  name: string;
  item: string;
}

// Generator functions

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = (): Organization => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description:
      "Faith-based tech innovation company specializing in UX design, product design, and tech training in Nigeria.",
    sameAs: [
      SITE_CONFIG.socialMedia.linkedin,
      SITE_CONFIG.socialMedia.twitter,
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      contactType: "Administration",
      email: SITE_CONFIG.email,
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country,
    },
  };
};

/**
 * Generate WebSite schema with search action
 */
export const generateWebSiteSchema = (): WebSite => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

/**
 * Generate Course schema
 */
export const generateCourseSchema = (courseData: {
  name: string;
  description: string;
  duration: string;
  price?: string;
  instructor?: string;
}): Course => {
  const course: Course = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseData.name,
    description: courseData.description,
    provider: generateOrganizationSchema(),
  };

  if (courseData.price) {
    course.offers = {
      "@type": "Offer",
      price: courseData.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
    };
  }

  course.hasCourseInstance = [
    {
      "@type": "CourseInstance",
      courseMode: "online",
      duration: courseData.duration,
      ...(courseData.instructor && {
        instructor: {
          "@type": "Person",
          name: courseData.instructor,
        },
      }),
    },
  ];

  return course;
};

/**
 * Generate FAQ schema
 */
export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): FAQPage => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate Service schema
 */
export const generateServiceSchema = (serviceData: {
  name: string;
  description: string;
  serviceType: string;
}): Service => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceData.name,
    description: serviceData.description,
    provider: generateOrganizationSchema(),
    areaServed: SITE_CONFIG.location.country,
    serviceType: serviceData.serviceType,
  };
};

/**
 * Generate Breadcrumb schema
 */
export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbList => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

/**
 * Generate LocalBusiness schema (for location-based SEO)
 */
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.name,
    image: SITE_CONFIG.logo,
    "@id": SITE_CONFIG.url,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: [
      { "@type": "City", name: "Lagos" },
      { "@type": "City", name: "Abuja" },
      { "@type": "City", name: "Port Harcourt" },
      { "@type": "Country", name: "Nigeria" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tech Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Design & Development",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "UX/UI Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Tech Training",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Design Training" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Software Development Bootcamp" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "DevOps Training" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Print & Branding",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Card Printing" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Large Format Printing" } },
          ],
        },
      ],
    },
    sameAs: [
      SITE_CONFIG.socialMedia.linkedin,
      SITE_CONFIG.socialMedia.twitter,
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
  };
};

/**
 * Generate EducationalOrganization schema
 */
export const generateEducationalOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description:
      "Tech training academy offering sponsored bootcamp programs in product design, software development, and more.",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      contactType: "Admissions",
      email: SITE_CONFIG.email,
    },
  };
};

/**
 * Generate BlogPosting schema for individual blog posts
 */
export const generateBlogPostSchema = (postData: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData.title,
    description: postData.description,
    image: postData.image || SITE_CONFIG.logo,
    url: `${SITE_CONFIG.url}${postData.url}`,
    datePublished: postData.datePublished,
    dateModified: postData.dateModified || postData.datePublished,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: SITE_CONFIG.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}${postData.url}`,
    },
    ...(postData.keywords && { keywords: postData.keywords.join(", ") }),
  };
};

/**
 * Generate Blog listing page schema
 */
export const generateBlogSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_CONFIG.name} Blog`,
    description:
      "Insights on design, technology, training, and building digital products. From the Gr8QM Technovates team.",
    url: `${SITE_CONFIG.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: SITE_CONFIG.logo,
      },
    },
  };
};

/**
 * Generate ProfessionalService schema (more specific than LocalBusiness for agencies)
 */
export const generateProfessionalServiceSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_CONFIG.name,
    image: SITE_CONFIG.logo,
    "@id": SITE_CONFIG.url,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: "$$",
    description:
      "Design and technology studio specializing in UX/UI design, web & mobile development, premium printing, and sponsored tech training in Lagos, Nigeria.",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    areaServed: [
      { "@type": "City", name: "Lagos" },
      { "@type": "City", name: "Abuja" },
      { "@type": "Country", name: "Nigeria" },
    ],
    knowsAbout: [
      "UX Design",
      "UI Design",
      "Product Design",
      "Web Development",
      "Mobile App Development",
      "React",
      "TypeScript",
      "Node.js",
      "Figma",
      "Design Systems",
      "Tech Training",
      "Print Design",
      "Brand Identity",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UX/UI Design",
          description: "User experience and interface design for web and mobile applications",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web & Mobile Development",
          description: "Custom web and mobile application development using modern technologies",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tech Training Bootcamp",
          description: "Sponsored tech training programs with job placement support",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Print & Branding",
          description: "Premium printing services and brand identity design",
        },
      },
    ],
    sameAs: [
      SITE_CONFIG.socialMedia.linkedin,
      SITE_CONFIG.socialMedia.twitter,
      SITE_CONFIG.socialMedia.instagram,
      SITE_CONFIG.socialMedia.facebook,
    ],
  };
};

/**
 * Generate WebPage schema for individual pages
 */
export const generateWebPageSchema = (pageData: {
  name: string;
  description: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageData.name,
    description: pageData.description,
    url: `${SITE_CONFIG.url}${pageData.url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: SITE_CONFIG.logo,
      },
    },
    inLanguage: "en-NG",
  };
};

/**
 * Helper to combine multiple schemas
 */
export const combineSchemas = (...schemas: unknown[]) => {
  return schemas;
};
