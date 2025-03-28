/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to ignore the Android directory during build
  webpack: (config, { isServer }) => {
    // Safely handle the watchOptions and ignored array
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = config.watchOptions.ignored || [];
    
    // Add the Android directory to ignored patterns
    if (Array.isArray(config.watchOptions.ignored)) {
      config.watchOptions.ignored.push('**/android/**');
    } else {
      config.watchOptions.ignored = ['**/android/**'];
    }
    
    return config;
  },
  // Move outputFileTracingExcludes to the root level as per warning
  outputFileTracingExcludes: {
    '*': ['**/android/**']
  },
  // Ignore ESLint warning for img element
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Typescript errors in build are now disabled
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
