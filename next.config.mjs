import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: ['https://framer.com/m/', 'https://framerusercontent.com/', 'https://fonts.gstatic.com/'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['framer'] = path.resolve(__dirname, 'framer-mock.js');
    return config;
  }
};

export default nextConfig;
