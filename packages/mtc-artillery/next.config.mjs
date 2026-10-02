import bundleAnalyzer from '@next/bundle-analyzer';

import i18nConfig from './src/i18n/config.json' with { type: 'json' };

// static export, bundled into the overlay app
const isExport = process.env.NEXT_OUTPUT === 'export';

/** @type {import('next').NextConfig} */
const config = {
  // i18n routing isn't supported by static exports, the locale is picked on the client instead
  i18n: isExport ? undefined : i18nConfig,
  images: isExport ? { unoptimized: true } : undefined,

  eslint: {
    // ran by itself as script command
    ignoreDuringBuilds: true,
  },

  output: process.env.NEXT_OUTPUT,
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(config);
