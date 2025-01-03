/** @type {import('next').NextConfig} */
const RedirectsRoutes = require('./RedirectsRoutes');
const DFXWebPackConfig = require('./dfx.webpack.config');
DFXWebPackConfig.initCanisterIds();

const webpack = require('webpack');

// Make DFX_NETWORK available to Web Browser with default "local" if DFX_NETWORK is undefined
const EnvPlugin = new webpack.EnvironmentPlugin({
  DFX_NETWORK: 'local',

  BASE_URL: 'https://icp-node.ammag.tech/v1/',
  // BASE_URL: 'http://localhost:4000/v1/',
  ASSETS_ID: 'bd3sg-teaaa-aaaaa-qaaba-cai',
  PROJECT_ID: '2NxypsJ5XEQ07prpeSQFPCqfpqc',
  PROJECT_SECRET: 'c388aa5fea94beee3f2b4795309d5480',
  NEXT_PUBLIC_GOOGLE_MAP_API:"AIzaSyDk-rwnNyAFaJRMaqZtGWnt3GQKTiQ2joU",
  MASTER_WALLET:
    's25sy-rsnmo-ud3bs-gepqx-rfa7b-hnnp4-s5d27-zwtr7-uovzz-qgloj-wae',
    CANISTER_ID_ICP_TOKEN_CANISTER:"dxfxs-weaaa-aaaaa-qaapa-cai"
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return RedirectsRoutes;
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  swcMinify: true,

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );
    // Plugin
    config.plugins.push(EnvPlugin);

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
  output: 'export',
  trailingSlash: true,
};
// next.config.js


module.exports = nextConfig;
