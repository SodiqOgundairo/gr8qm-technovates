import { Helmet } from "react-helmet-async";
import {
  SITE_CONFIG,
  generateTitle,
  generateCanonicalURL,
} from "../../utils/seo-config";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: string;
  structuredData?: unknown | unknown[];
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData,
  noindex = false,
  nofollow = false,
}: SEOProps) => {
  const defaultDescription =
    "Leading UX design, product design, and tech training company in Nigeria. Faith-based innovation with AI-powered solutions and sponsored bootcamp programs.";
  const defaultKeywords = [
    "UX design",
    "product design",
    "tech training",
    "faith and tech",
    "UI/UX design services",
    "tech bootcamp Nigeria",
    "product design agency",
    "Christian tech company",
    "sponsored tech training",
    "software development training",
  ];

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : SITE_CONFIG.url;
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const metaTitle = title ? generateTitle(title) : SITE_CONFIG.name;
  const metaDescription = description || defaultDescription;

  // Handle keywords as array or string
  const keywordsArray = Array.isArray(keywords)
    ? keywords
    : keywords
      ? [keywords]
      : defaultKeywords;
  const metaKeywords = keywordsArray.join(", ");

  // Generate image URL
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : SITE_CONFIG.logo;

  // Generate canonical URL
  const metaUrl = url
    ? url.startsWith("http")
      ? url
      : generateCanonicalURL(url)
    : `${siteUrl}${currentPath}`;

  // Base organization schema (always included)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description: defaultDescription,
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

  // Combine all structured data
  const allStructuredData = structuredData
    ? Array.isArray(structuredData)
      ? [organizationSchema, ...structuredData]
      : [organizationSchema, structuredData]
    : [organizationSchema];

  // Robots meta tag
  const robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />
      <meta name="robots" content={robotsContent} />

      {/* Additional SEO meta tags */}
      <meta name="author" content={SITE_CONFIG.name} />
      <meta name="publisher" content={SITE_CONFIG.name} />
      <meta name="language" content="English" />
      <meta
        name="geo.region"
        content={`${SITE_CONFIG.location.country}-${SITE_CONFIG.location.state}`}
      />
      <meta name="geo.placename" content={SITE_CONFIG.location.city} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@gr8qmtechnovate" />
      <meta name="twitter:creator" content="@gr8qmtechnovate" />

      {/* Structured Data - Multiple schemas */}
      {allStructuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
