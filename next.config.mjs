/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "api.mcpedl.com"
      }
    ]
  },};

export default nextConfig;
