import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}: SEOProps) => {
  const siteTitle = 'Gr8qm Technovates';
  const defaultDescription = 'Empowering businesses with cutting-edge technology solutions. We specialize in software development, digital transformation, and innovative tech strategies.';
  const defaultKeywords = 'technology, software development, digital transformation, innovation, tech company, Gr8qm Technovates';
  const siteUrl = window.location.origin;
  const defaultImage = `${siteUrl}/assets/og-image.png`; // Placeholder

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const metaUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gr8qm Technovates",
    "url": siteUrl,
    "logo": `${siteUrl}/assets/logo.png`, // Placeholder
    "sameAs": [
      "https://www.linkedin.com/company/gr8qm-technovates",
      "https://twitter.com/gr8qm"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555", // Placeholder
      "contactType": "customer service"
    }
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
