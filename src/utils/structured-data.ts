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
      // Add actual coordinates if available
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
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
 * Helper to combine multiple schemas
 */
export const combineSchemas = (...schemas: unknown[]) => {
  return schemas;
};
