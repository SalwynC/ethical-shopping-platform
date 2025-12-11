import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!noprecache/**/*'],
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['cheerio'],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Force dynamic rendering for all pages
  output: 'standalone',
  // Enable dynamic features
  images: {
    domains: ['images.unsplash.com', 'm.media-amazon.com', 'i.ebayimg.com'],
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
