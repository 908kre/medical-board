const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  redirects: async () => [
    {
      source: "/",
      destination: "/metrics",
      permanent: true, // 301リダイレクト
    },
  ],
};

export default nextConfig;
