const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정
};

module.exports = withNextIntl(nextConfig);