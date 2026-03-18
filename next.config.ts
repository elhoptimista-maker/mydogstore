
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fullerton.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mascotaexpress.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'mascotaexpress.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.distribuidoralira.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.falabella.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.impopet.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'companiadealimentos.com.ar',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mydog.cl',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
