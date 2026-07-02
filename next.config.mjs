/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["ahikurumsal.com", "www.ahikurumsal.com"],
    },
  },
  async redirects() {
    return [
      { source: "/pratik-bilgiler", destination: "/haberler", permanent: true },
      { source: "/pratik-bilgiler/:slug", destination: "/haberler/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.ahikurumsal.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
