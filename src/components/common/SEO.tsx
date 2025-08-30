import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const defaultTitle = 'Gr8QM Technovates | Tech with purpose, faith, and impact';
  const pageTitle = title ? `${title} | Gr8QM Technovates` : defaultTitle;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || pageTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || 'https://res.cloudinary.com/dmxfjy079/image/upload/v1756125593/Gr8QMTechnovates/Images/svgIcons/Gr8QMNewLogoIcon_s8iaaf.svg'} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={twitterTitle || pageTitle} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || 'https://res.cloudinary.com/dmxfjy079/image/upload/v1756125593/Gr8QMTechnovates/Images/svgIcons/Gr8QMNewLogoIcon_s8iaaf.svg'} />
    </Helmet>
  );
};

export default SEO;
