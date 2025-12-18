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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['cheerio'],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable dynamic features for full server-side rendering
  images: {
    domains: ['images.unsplash.com', 'm.media-amazon.com', 'i.ebayimg.com'],
    unoptimized: true,
  },
  // Dynamic rendering configuration
  env: {
    NEXT_PUBLIC_DYNAMIC_RENDERING: 'true',
  },
};

export default withPWA(nextConfig);
