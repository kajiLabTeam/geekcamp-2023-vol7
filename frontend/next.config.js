/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  plugins: ["~/plugins/contentful", "~/plugins/prism"],
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://wisdomtree-api.kajilab.tk/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
