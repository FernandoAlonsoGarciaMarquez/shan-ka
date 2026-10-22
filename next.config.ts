import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",           // статический экспорт вместо сервера
  images: { unoptimized: true }, // next/image не работает без сервера-оптимизатора
  trailingSlash: true,        // /page -> /page/index.html — надёжнее для статик-хостингов


  
  // Нужно только для GitHub Pages project-сайта (username.github.io/repo-name)
  // Если у вас user/org-сайт (username.github.io) или свой домен — не нужно

  // basePath: process.env.NODE_ENV === "production" ? "/repo-name" : "",
  // assetPrefix: process.env.NODE_ENV === "production" ? "/repo-name/" : "",
};

export default nextConfig;
