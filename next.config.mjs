/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // This tells the compiler to handle modern JS in these packages
  transpilePackages: ['undici', '@firebase/auth'],
};

export default nextConfig;