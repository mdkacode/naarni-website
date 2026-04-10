import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the SEO data
const seoConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../seo-config.json'), 'utf8'));

const pageSEOData = {
  '/': {
    title: 'NaArNi - Electrifying Intercity Buses | Smart EV Solutions',
    description: 'Transform your fleet with NaArNi\'s smart EV solutions. Best-in-class electric buses, financing, charging infrastructure, and maintenance services for fleet operators.',
    keywords: 'electric vehicles, heavy commercial vehicles, EV fleet, electric trucks, electric buses, fleet electrification, EV charging, battery replacement, EV financing, HCV electric vehicles, sustainable transportation, green fleet, electric mobility, NaArNi',
    canonical: 'https://naarni.in',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is NaArNi?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'NaArNi is a company focused on Electrifying Intercity Buses with smart EV solutions, offering best-in-class products, financing, charging, and maintenance services.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What types of vehicles does NaArNi offer?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We currently offer intercity electric buses and are expanding to include heavy electric trucks. Our vehicles are designed for long hauls and fleet operations.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How does NaArNi help with financing?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We provide access to long-term, cost-effective financing options through our banking and NBFC partnerships, making EV adoption easier for fleet operators.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What charging solutions does NaArNi provide?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We offer access to a wide network of fast, reliable, and cost-effective charging stations across India to support your fleet operations.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What maintenance services are available?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We provide high-voltage AMC (Annual Maintenance Contract) and full vehicle-life support to ensure reliability and optimal performance.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How does NaArNi ensure battery reliability?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We offer guaranteed battery replacement and performance reliability through our comprehensive battery assurance program.'
          }
        }
      ]
    },
    breadcrumbs: [
      { name: 'Home', url: '/' }
    ]
  },
  '/about': {
    title: 'About NaArNi - Leading EV Solutions for Heavy Commercial Vehicles',
    description: 'Learn about NaArNi\'s mission to electrify heavy transport. Founded by experienced entrepreneurs from IIT-Bombay and IIM-Ahmedabad, we\'re building the future of sustainable mobility.',
    keywords: 'NaArNi about, EV company, electric vehicle founders, sustainable transportation, heavy commercial vehicles, fleet electrification, IIT-Bombay, IIM-Ahmedabad, Mozev, Greencell',
    canonical: 'https://naarni.in/about',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' }
    ]
  },
  '/products': {
    title: 'NaArNi Products - Heavy Electric Buses & Trucks for Fleet Operators',
    description: 'Discover NaArNi\'s heavy electric vehicles designed for fleet operators. Best-in-class intercity electric buses with 100+ km range, fast charging, and lowest cost per km.',
    keywords: 'electric buses, heavy electric vehicles, fleet electric vehicles, intercity electric buses, EV fleet, electric commercial vehicles, heavy commercial EVs, NaArNi products',
    canonical: 'https://naarni.in/products',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'NaArNi Intercity Electric Bus',
      'description': 'Best-in-class intercity electric bus designed for fleet operators with 100+ km range and fast charging capabilities',
      'brand': {
        '@type': 'Brand',
        'name': 'NaArNi'
      },
      'manufacturer': {
        '@type': 'Organization',
        'name': 'NaArNi',
        'url': 'https://naarni.in'
      },
      'category': 'Heavy Commercial Vehicle',
      'vehicleType': 'Electric Bus',
      'fuelType': 'Electric',
      'range': '100+ km per charge',
      'chargingTime': '1.5 hours',
      'image': 'https://naarni.in/images/ev-bus.jpg',
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock',
        'priceCurrency': 'INR',
        'url': 'https://naarni.in/contact'
      }
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' }
    ]
  },
  '/contact': {
    title: 'Contact NaArNi - Get in Touch for EV Fleet Solutions',
    description: 'Contact NaArNi for product enquiries, fleet electrification support, or to learn more about our electric vehicle solutions. Get expert guidance on EV adoption.',
    keywords: 'contact NaArNi, EV fleet consultation, electric vehicle support, fleet electrification help, NaArNi contact, EV solutions contact',
    canonical: 'https://naarni.in/contact',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'NaArNi',
      'description': 'Leading provider of electric heavy commercial vehicles and comprehensive EV fleet solutions',
      'url': 'https://naarni.in',
      'telephone': '+91-XXXXXXXXXX',
      'email': 'website@naarni.in',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '6th floor, Sakti Statesman, Marathahalli - Sarjapur Outer Ring Rd, Green Glen Layout, Bellandur',
        'addressLocality': 'Bengaluru',
        'addressRegion': 'Karnataka',
        'postalCode': '560103',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '12.923394115937104',
        'longitude': '77.66506397320866'
      },
      'openingHours': 'Mo-Fr 09:00-18:00',
      'priceRange': '$$',
      'image': 'https://naarni.in/images/ev-bus.jpg',
      'sameAs': [
        'https://www.linkedin.com/company/naarni'
      ]
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' }
    ]
  },
  '/track-record': {
    title: 'NaArNi Track Record - Proven Success in Electric Vehicle Industry',
    description: 'Explore NaArNi\'s proven track record in the electric vehicle industry. From Mozev to Greencell acquisition, discover our journey in revolutionizing heavy transport.',
    keywords: 'NaArNi track record, EV industry success, Mozev, Greencell, electric vehicle achievements, fleet electrification history',
    canonical: 'https://naarni.in/track-record',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Track Record', url: '/track-record' }
    ]
  },
  '/careers': {
    title: 'Careers at NaArNi - Join the Electric Vehicle Revolution',
    description: 'Join NaArNi\'s mission to electrify heavy transport. Explore career opportunities in electric vehicle technology, fleet management, and sustainable mobility.',
    keywords: 'NaArNi careers, EV jobs, electric vehicle careers, sustainable mobility jobs, fleet management careers, green technology jobs',
    canonical: 'https://naarni.in/careers',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Careers', url: '/careers' }
    ]
  },
  '/privacy-policy': {
    title: 'Privacy Policy - NaArNi',
    description: 'NaArNi\'s privacy policy outlining how we collect, use, and protect your personal information.',
    keywords: 'NaArNi privacy policy, data protection, privacy terms',
    canonical: 'https://naarni.in/privacy-policy',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy' }
    ]
  },
  '/terms': {
    title: 'Terms of Service - NaArNi',
    description: 'NaArNi\'s terms of service outlining the terms and conditions for using our website and services.',
    keywords: 'NaArNi terms of service, terms and conditions, legal terms',
    canonical: 'https://naarni.in/terms',
    ogImage: 'https://naarni.in/images/ev-bus.jpg',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Terms of Service', url: '/terms' }
    ]
  }
};

function generateOrganizationSchema() {
  return {
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
  };
}

function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoConfig.site.name,
    "url": seoConfig.site.url,
    "description": seoConfig.site.description
  };
}

function generateBreadcrumbSchema(breadcrumbs) {
  if (!breadcrumbs) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${seoConfig.site.url}${item.url}`
    }))
  };
}

function generateHTML(seoData) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const breadcrumbSchema = generateBreadcrumbSchema(seoData.breadcrumbs);
  
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>${seoData.title}</title>
    <meta name="title" content="${seoData.title}" />
    <meta name="description" content="${seoData.description}" />
    <meta name="keywords" content="${seoData.keywords}" />
    <meta name="author" content="${seoConfig.site.author}" />
    <meta name="robots" content="${seoConfig.seo.robots}" />
    <meta name="language" content="${seoConfig.site.language}" />
    <meta name="revisit-after" content="7 days" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seoData.canonical}" />
    <meta property="og:title" content="${seoData.title}" />
    <meta property="og:description" content="${seoData.description}" />
    <meta property="og:image" content="${seoData.ogImage}" />
    <meta property="og:site_name" content="${seoConfig.site.name}" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${seoData.canonical}" />
    <meta name="twitter:title" content="${seoData.title}" />
    <meta name="twitter:description" content="${seoData.description}" />
    <meta name="twitter:image" content="${seoData.ogImage}" />
    
    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="${seoConfig.seo.themeColor}" />
    <meta name="msapplication-TileColor" content="${seoConfig.seo.themeColor}" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${seoConfig.site.name}" />
    
    <!-- Enhanced SEO Meta Tags -->
    <meta name="geo.region" content="${seoConfig.site.region}" />
    <meta name="geo.placename" content="${seoConfig.site.location}" />
    <meta name="geo.position" content="${seoConfig.site.coordinates.latitude};${seoConfig.site.coordinates.longitude}" />
    <meta name="ICBM" content="${seoConfig.site.coordinates.latitude}, ${seoConfig.site.coordinates.longitude}" />
    <meta name="DC.title" content="${seoData.title}" />
    <meta name="DC.creator" content="${seoConfig.site.author}" />
    <meta name="DC.subject" content="${seoData.keywords}" />
    <meta name="DC.description" content="${seoData.description}" />
    <meta name="DC.publisher" content="${seoConfig.site.name}" />
    <meta name="DC.contributor" content="${seoConfig.site.name}" />
    <meta name="DC.date" content="${new Date().toISOString().split('T')[0]}" />
    <meta name="DC.type" content="Text" />
    <meta name="DC.format" content="text/html" />
    <meta name="DC.identifier" content="${seoData.canonical}" />
    <meta name="DC.language" content="${seoConfig.site.language}" />
    <meta name="DC.rights" content="Copyright NaArNi" />
    <meta name="DC.coverage" content="India" />
    <meta name="DC.audience" content="Fleet Operators, Commercial Vehicle Owners" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${seoData.canonical}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    
    <!-- Sitemap -->
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
    
    <!-- Structured Data / JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(organizationSchema, null, 2)}
    </script>
    
    <script type="application/ld+json">
    ${JSON.stringify(websiteSchema, null, 2)}
    </script>
    
    ${breadcrumbSchema ? `<script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>` : ''}
    
    ${seoData.structuredData ? `<script type="application/ld+json">
    ${JSON.stringify(seoData.structuredData, null, 2)}
    </script>` : ''}
    
    <script type="module" crossorigin src="/assets/index-CcbOdq1g.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BSm94UA8.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Generate HTML files for each route
const routes = Object.keys(pageSEOData);
const distDir = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

routes.forEach(route => {
  const seoData = pageSEOData[route];
  const html = generateHTML(seoData);
  
  // For root route, save as index.html
  if (route === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
  } else {
    // For other routes, create directory and index.html
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), html);
  }
  
  console.log(`Generated SEO-optimized HTML for route: ${route}`);
});

console.log('✅ Static SEO HTML generation complete!');
