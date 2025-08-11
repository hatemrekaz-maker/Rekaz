// @ts-check
import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const baseConfig = {
  experimental: { typedRoutes: true },
  reactStrictMode: true
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
  fallbacks: {
    document: '/offline.html'
  },
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
      handler: 'CacheFirst',
      options: { cacheName: 'static-assets-v1', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } }
    },
    {
      urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'font',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'media-v1', expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 } }
    },
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'pages-v1', networkTimeoutSeconds: 3 }
    }
  ]
})(baseConfig);
