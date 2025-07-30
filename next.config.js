/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración webpack para suprimir warnings en desarrollo
  webpack: (config, { dev }) => {
    if (dev) {
      // Suprimir warnings de SES en desarrollo
      config.ignoreWarnings = [
        { message: /dateTaming.*deprecated/ },
        { message: /mathTaming.*deprecated/ },
        { message: /Removing unpermitted intrinsics/ },
      ];
    }
    return config;
  },
  
  // Configuraciones adicionales para producción
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig 