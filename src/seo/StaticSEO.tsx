import React from 'react';
import { getPageSEOData } from './pageData';
import seoConfig from '../../seo-config.json';

interface StaticSEOProps {
  path: string;
}

const StaticSEO: React.FC<StaticSEOProps> = ({ path }) => {
  const seoData = getPageSEOData(path);
  
  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seoConfig.site.name,
    "url": seoConfig.site.url,
    "logo": seoConfig.seo.defaultImage,
    "description": seoConfig.site.description,
    "foundingDate": seoConfig.structuredData.organization.foundingDate,
    "industry": seoConfig.structuredData.organization.industry,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.contact.address.street,
      "addressLocality": seoConfig.contact.address.city,
      "addressRegion": seoConfig.contact.address.state,
      "postalCode": seoConfig.contact.address.postalCode,
      "addressCountry": seoConfig.contact.address.country
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": seoConfig.contact.email,
      "url": `${seoConfig.site.url}/contact`
    },
    "sameAs": seoConfig.social.linkedin ? [seoConfig.social.linkedin] : []
  });

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoConfig.site.name,
    "url": seoConfig.site.url,
    "description": seoConfig.site.description
  });

  const generateBreadcrumbSchema = () => {
    if (!seoData.breadcrumbs) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": seoData.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${seoConfig.site.url}${item.url}`
      }))
    };
  };

  // This component will be used to generate static HTML
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="title" content={seoData.title} />
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="author" content={seoConfig.site.author} />
      <meta name="robots" content={seoConfig.seo.robots} />
      <meta name="language" content={seoConfig.site.language} />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoData.canonical} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.ogImage} />
      <meta property="og:site_name" content={seoConfig.site.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoData.canonical} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content={seoConfig.seo.themeColor} />
      <meta name="msapplication-TileColor" content={seoConfig.seo.themeColor} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoConfig.site.name} />
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="geo.region" content={seoConfig.site.region} />
      <meta name="geo.placename" content={seoConfig.site.location} />
      <meta name="geo.position" content={`${seoConfig.site.coordinates.latitude};${seoConfig.site.coordinates.longitude}`} />
      <meta name="ICBM" content={`${seoConfig.site.coordinates.latitude}, ${seoConfig.site.coordinates.longitude}`} />
      <meta name="DC.title" content={seoData.title} />
      <meta name="DC.creator" content={seoConfig.site.author} />
      <meta name="DC.subject" content={seoData.keywords} />
      <meta name="DC.description" content={seoData.description} />
      <meta name="DC.publisher" content={seoConfig.site.name} />
      <meta name="DC.contributor" content={seoConfig.site.name} />
      <meta name="DC.date" content={new Date().toISOString().split('T')[0]} />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content={seoData.canonical} />
      <meta name="DC.language" content={seoConfig.site.language} />
      <meta name="DC.rights" content="Copyright NaArNi" />
      <meta name="DC.coverage" content="India" />
      <meta name="DC.audience" content="Fleet Operators, Commercial Vehicle Owners" />
      
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateOrganizationSchema())
      }} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateWebsiteSchema())
      }} />
      
      {seoData.breadcrumbs && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema())
        }} />
      )}
      
      {seoData.structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.structuredData)
        }} />
      )}
    </>
  );
};

export default StaticSEO;
