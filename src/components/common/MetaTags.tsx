import { useEffect } from 'react';

// Define the props the component will accept
interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  structuredData?: object;
  keywords?: string;
  author?: string;
  robots?: string;
}

// Define default values for when no props are provided
const DEFAULTS = {
  TITLE: 'LegacyGuard | Your Legacy, Secured. Your Family, Protected.',
  DESCRIPTION: "The most caring and secure way to organize your life's journey and protect your family's future. AI-powered document management, family shield protocol, and will creation.",
  // Social media image - 1200x630px for optimal sharing
  IMAGE_URL: 'https://legacyguard.app/og-image.png',
  URL: 'https://legacyguard.app',
  KEYWORDS: 'legacy planning, document management, family protection, digital vault, will creation, emergency planning, secure storage, AI assistant',
  AUTHOR: 'LegacyGuard',
  ROBOTS: 'index, follow',
};

export const MetaTags = ({
  title,
  description,
  imageUrl,
  url,
  structuredData,
  keywords,
  author,
  robots
}: MetaTagsProps ) => {
  // Use provided props or fall back to the default values
  const pageTitle = title ? `${title} | LegacyGuard` : DEFAULTS.TITLE;
  const pageDescription = description || DEFAULTS.DESCRIPTION;
  const pageImageUrl = imageUrl || DEFAULTS.IMAGE_URL;
  const pageUrl = url || DEFAULTS.URL;
  const pageKeywords = keywords || DEFAULTS.KEYWORDS;
  const pageAuthor = author || DEFAULTS.AUTHOR;
  const pageRobots = robots || DEFAULTS.ROBOTS;

  // Default structured data for LegacyGuard
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LegacyGuard",
    "description": pageDescription,
    "url": pageUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "category": "Free"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": "1"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={pageAuthor} />
      <meta name="robots" content={pageRobots} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph for Social Media (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImageUrl} />
      <meta property="og:site_name" content="LegacyGuard" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImageUrl} />

      {/* Structured data for search engines */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};
