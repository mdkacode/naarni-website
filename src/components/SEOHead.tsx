import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  structuredData?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  structuredData,
  breadcrumbs,
  faqs
}) => {
  const generateBreadcrumbSchema = () => {
    if (!breadcrumbs) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${window.location.origin}${item.url}`
      }))
    };
  };

  const generateFAQSchema = () => {
    if (!faqs) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NaArNi",
    "url": "https://naarni.com",
    "logo": "https://naarni.com/images/ev-bus.jpg",
    "description": "Leading provider of electric heavy commercial vehicles and comprehensive EV fleet solutions",
    "foundingDate": "2020",
    "industry": "Electric Vehicles",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "6th floor, Sakti Statesman, Marathahalli - Sarjapur Outer Ring Rd, Green Glen Layout, Bellandur",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560103",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "website@naarni.com",
      "url": "https://naarni.com/contact"
    },
    "sameAs": [
      "https://www.linkedin.com/company/naarni"
    ]
  });

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NaArNi",
    "url": "https://naarni.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://naarni.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical URL - Remove existing canonical first to avoid duplicates
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    if (canonical) {
      let canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonical);
      document.head.appendChild(canonicalLink);
    }
    
    // Update Open Graph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:url', canonical || window.location.href);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:site_name', 'NaArNi');
    updateOrCreateMeta('og:locale', 'en_US');
    updateOrCreateMeta('og:image', 'https://naarni.com/images/ev-bus.jpg');
    
    // Update Twitter Card tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:title', title);
    updateOrCreateTwitterMeta('twitter:description', description);
    updateOrCreateTwitterMeta('twitter:image', 'https://naarni.com/images/ev-bus.jpg');
    
    // Add robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Add structured data scripts
    const addStructuredData = (data: any, id: string) => {
      if (!data) return;
      
      // Remove existing script if it exists
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };
    
    // Add all structured data
    addStructuredData(generateOrganizationSchema(), 'org-schema');
    addStructuredData(generateWebsiteSchema(), 'website-schema');
    if (breadcrumbs) {
      addStructuredData(generateBreadcrumbSchema(), 'breadcrumb-schema');
    }
    if (faqs) {
      addStructuredData(generateFAQSchema(), 'faq-schema');
    }
    if (structuredData) {
      addStructuredData(structuredData, 'custom-schema');
    }
    
    // Cleanup function
    return () => {
      // Remove structured data scripts when component unmounts
      ['org-schema', 'website-schema', 'breadcrumb-schema', 'faq-schema', 'custom-schema'].forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, [title, description, keywords, canonical, structuredData, breadcrumbs, faqs]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
