
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.replicate.delivery",
      },
    ],
  },
  // Disable ESLint during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
