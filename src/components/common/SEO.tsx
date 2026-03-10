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
    "Gr8QM Technovates is a design and technology studio in Lagos, Nigeria. We build digital products, deliver premium print, and run sponsored tech training programs.";
  const defaultKeywords = [
    "UX design agency Lagos",
    "product design Nigeria",
    "tech training Lagos",
    "web development company Lagos",
    "UI/UX design services Nigeria",
    "tech bootcamp Nigeria",
    "product design agency Lagos",
    "digital agency Lagos",
    "print services Lagos",
    "software development training Nigeria",
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
      <meta name="content-language" content="en-NG" />
      <meta httpEquiv="content-language" content="en-NG" />

      {/* Geo Tags - Lagos, Nigeria */}
      <meta name="geo.region" content="NG-LA" />
      <meta name="geo.placename" content="Lagos, Nigeria" />
      <meta name="geo.position" content="6.5244;3.3792" />
      <meta name="ICBM" content="6.5244, 3.3792" />
      <meta name="DC.title" content={metaTitle} />
      <meta name="DC.creator" content={SITE_CONFIG.name} />
      <meta name="DC.subject" content={metaKeywords} />
      <meta name="DC.description" content={metaDescription} />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Lagos, Nigeria, West Africa" />
      <meta name="distribution" content="global" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="3 days" />
      <meta name="coverage" content="Worldwide" />
      <meta name="classification" content="Technology, Design, Education, Printing" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content="en_NG" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />

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
