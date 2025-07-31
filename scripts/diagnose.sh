#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO DEL SERVIDOR"
echo "======================================"
echo ""

echo "📋 Variables de entorno del sistema:"
echo "   NODE_ENV: ${NODE_ENV:-NO CONFIGURADA}"
echo "   PORT: ${PORT:-NO CONFIGURADA}"
echo "   HOSTNAME: ${HOSTNAME:-NO CONFIGURADA}"
echo ""

echo "🗄️  Variables de base de datos:"
echo "   DB_HOST: ${DB_HOST:-NO CONFIGURADA}"
echo "   DB_USER: ${DB_USER:-NO CONFIGURADA}"
echo "   DB_NAME: ${DB_NAME:-NO CONFIGURADA}"
echo "   DB_PORT: ${DB_PORT:-NO CONFIGURADA}"
echo "   DB_PASSWORD: ${DB_PASSWORD:+CONFIGURADA}"
echo ""

echo "🔗 Probando conectividad de red:"
if command -v ping &> /dev/null; then
    if [ -n "$DB_HOST" ]; then
        echo "   Ping a $DB_HOST:"
        ping -c 1 $DB_HOST 2>/dev/null | head -2
    else
        echo "   ❌ DB_HOST no configurado"
    fi
else
    echo "   ⚠️  ping no disponible"
fi

echo ""
echo "🚀 Verificando archivos de la aplicación:"
if [ -f ".next/standalone/server.js" ]; then
    echo "   ✅ Servidor standalone encontrado"
    echo "   📏 Tamaño: $(ls -lh .next/standalone/server.js | awk '{print $5}')"
else
    echo "   ❌ Servidor standalone no encontrado"
fi

if [ -d ".next/standalone/.next/static" ]; then
    echo "   ✅ Archivos estáticos encontrados"
    echo "   📁 Archivos CSS: $(find .next/standalone/.next/static/css -name "*.css" 2>/dev/null | wc -l)"
    echo "   📁 Archivos JS: $(find .next/standalone/.next/static/chunks -name "*.js" 2>/dev/null | wc -l)"
else
    echo "   ❌ Archivos estáticos no encontrados"
fi

echo ""
echo "🐳 Verificando Docker (si está disponible):"
if command -v docker &> /dev/null; then
    echo "   ✅ Docker disponible"
    echo "   📊 Containers ejecutándose: $(docker ps -q | wc -l)"
    echo "   📊 Imágenes: $(docker images -q | wc -l)"
else
    echo "   ⚠️  Docker no disponible"
fi

echo ""
echo "📊 Información del sistema:"
echo "   💾 Memoria: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "   💿 Disco: $(df -h / | tail -1 | awk '{print $5}')"
echo "   🔥 CPU: $(nproc) cores"
echo "   🐧 Kernel: $(uname -r)"

echo ""
echo "🔍 Procesos Node.js:"
ps aux | grep node | grep -v grep | head -5

echo ""
echo "📝 Logs recientes del sistema:"
if [ -f "/var/log/syslog" ]; then
    tail -5 /var/log/syslog | grep -i error
elif [ -f "/var/log/messages" ]; then
    tail -5 /var/log/messages | grep -i error
else
    echo "   ⚠️  No se encontraron logs del sistema"
fi

echo ""
echo "✅ Diagnóstico completado" 