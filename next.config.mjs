/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['undici', 'firebase'], // Forces Next to fix the syntax during build
};

export default nextConfig;