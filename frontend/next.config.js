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
        destination:
            process.env.NODE_ENV === "production"
              ? "https://wisdomtree-api.kajilab.tk/api/:path*" // 本番用
              : "http://localhost:8091/api/:path*", // 開発用
      },
    ];
  },
};

module.exports = nextConfig;
