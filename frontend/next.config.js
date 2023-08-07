/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://karasuneo.com/api/:path*" // 本番用
            : "http://karasuneo.com/api/:path*", // 開発用
      },
    ];
  },
};

module.exports = nextConfig;
