/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración webpack para suprimir warnings en desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Suprimir warnings de SES en desarrollo
      config.ignoreWarnings = [
        { message: /dateTaming.*deprecated/ },
        { message: /mathTaming.*deprecated/ },
        { message: /Removing unpermitted intrinsics/ },
      ];
    }
    
    // Configuración específica para evitar problemas con mysql2 durante el build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('mysql2');
    }
    
    return config;
  },
  
  // Configuraciones adicionales para producción
  poweredByHeader: false,
  compress: true,
  
  // Configuración para evitar problemas durante el build
  experimental: {
    // Evitar que Next.js intente ejecutar las rutas API durante el build
    serverComponentsExternalPackages: ['mysql2', 'bcryptjs'],
  },
  
  // Configuración para manejar variables de entorno
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Configuración para el build
  output: 'standalone',
  
  // Configuración para evitar que las rutas API se ejecuten durante el build
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 