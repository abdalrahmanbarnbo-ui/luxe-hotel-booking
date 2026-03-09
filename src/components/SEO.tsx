import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
}

export default function SEO({ title, description, name = 'Luxe Hotel', type = 'website', url, image }: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      
      {/* OpenGraph tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {url && <meta property='og:url' content={url} />}
      {image && <meta property='og:image' content={image} />}
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      
      {/* Schema.org LocalBusiness / Hotel */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": name,
          "description": description,
          "url": url || window.location.href,
          "image": image,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Luxury Ave",
            "addressLocality": "Paradise City",
            "addressRegion": "PC",
            "postalCode": "12345",
            "addressCountry": "US"
          },
          "telephone": "+1-555-0198",
          "priceRange": "$$$"
        })}
      </script>
    </Helmet>
  );
}
