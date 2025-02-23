import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { getMetaTags } from '../config/metaTags';

const MetaTags = () => {
  const location = useLocation();
  const meta = getMetaTags(location.pathname);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:url" content={meta.url} />
      <meta property="twitter:title" content={meta.title} />
      <meta property="twitter:description" content={meta.description} />
    </Helmet>
  );
};

export default MetaTags;