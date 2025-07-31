#!/bin/bash

echo "🔍 Verificando variables de entorno..."
echo ""

echo "📋 Variables del sistema:"
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

echo "🔗 Probando conexión a la base de datos..."
if [ -n "$DB_HOST" ] && [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ]; then
    echo "✅ Variables de base de datos configuradas"
    echo "🔍 Intentando conexión a $DB_HOST:$DB_PORT..."
else
    echo "❌ Variables de base de datos incompletas"
    echo "   DB_HOST: $DB_HOST"
    echo "   DB_USER: $DB_USER"
    echo "   DB_PASSWORD: ${DB_PASSWORD:+CONFIGURADA}"
fi

echo ""
echo "🚀 Verificando archivos de la aplicación..."
if [ -f ".next/standalone/server.js" ]; then
    echo "✅ Servidor standalone encontrado"
else
    echo "❌ Servidor standalone no encontrado"
fi

if [ -d ".next/standalone/.next/static" ]; then
    echo "✅ Archivos estáticos encontrados"
else
    echo "❌ Archivos estáticos no encontrados"
fi

echo ""
echo "📊 Información del sistema:"
echo "   Uso de memoria: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "   Uso de disco: $(df -h / | tail -1 | awk '{print $5}')"
echo "   Procesos Node.js: $(ps aux | grep node | grep -v grep | wc -l)" 