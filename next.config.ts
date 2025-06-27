import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'media.istockphoto.com',
      'images.unsplash.com', 
      'plus.unsplash.com',
      'source.unsplash.com',
      'www.istockphoto.com',
      'fitarena.s3.amazonaws.com'
    ],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;