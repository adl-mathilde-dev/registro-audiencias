#!/bin/bash

echo "🔄 Reiniciando servidor..."

# Detener procesos de Node.js
echo "🛑 Deteniendo procesos de Node.js..."
pkill -f "node .next/standalone/server.js" 2>/dev/null
pkill -f "next start" 2>/dev/null
pkill -f "next dev" 2>/dev/null

# Esperar un momento
sleep 2

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
rm -rf .next/cache 2>/dev/null

# Verificar que no hay procesos ejecutándose
echo "🔍 Verificando procesos..."
ps aux | grep node | grep -v grep

# Reconstruir si es necesario
if [ "$1" = "--rebuild" ]; then
    echo "🔨 Reconstruyendo aplicación..."
    npm run build
fi

echo "✅ Servidor detenido. Para iniciar nuevamente:"
echo "   npm run start" 