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

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        const [type, value] = selector.split('=');
        const attrName = type.includes('property') ? 'property' : 'name';
        element.setAttribute(attrName, value.replace(/["[\]]/g, ''));
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Update standard SEO meta tags
    updateMetaTag('meta[name="description"]', pageDescription);
    updateMetaTag('meta[name="keywords"]', pageKeywords);
    updateMetaTag('meta[name="author"]', pageAuthor);
    updateMetaTag('meta[name="robots"]', pageRobots);
    updateLinkTag('canonical', pageUrl);

    // Update Open Graph meta tags
    updateMetaTag('meta[property="og:type"]', 'website');
    updateMetaTag('meta[property="og:url"]', pageUrl);
    updateMetaTag('meta[property="og:title"]', pageTitle);
    updateMetaTag('meta[property="og:description"]', pageDescription);
    updateMetaTag('meta[property="og:image"]', pageImageUrl);
    updateMetaTag('meta[property="og:site_name"]', 'LegacyGuard');
    updateMetaTag('meta[property="og:locale"]', 'en_US');

    // Update Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:url"]', pageUrl);
    updateMetaTag('meta[name="twitter:title"]', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', pageDescription);
    updateMetaTag('meta[name="twitter:image"]', pageImageUrl);

    // Update structured data
    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(finalStructuredData);

    // Cleanup function (optional - keeps meta tags in place for SPA navigation)
    return () => {
      // If you want to reset to defaults when component unmounts, uncomment below:
      // document.title = DEFAULTS.TITLE;
    };
  }, [pageTitle, pageDescription, pageImageUrl, pageUrl, pageKeywords, pageAuthor, pageRobots, finalStructuredData]);

  // This component doesn't render anything visible
  return null;
};
