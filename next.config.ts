import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^tap$/,
      })
    );
    return config;
  },
};

export default nextConfig;
