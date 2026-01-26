#!/bin/bash

echo "🔍 Verificare și restart server..."
echo ""

# 1. Verifică dacă există worktree și sincronizează
if [ -f "/Users/alexgeo/.cursor/worktrees/event-venue-buzau/yue/app/admin/page.tsx" ]; then
    echo "⚠️  Worktree detectat! Sincronizare..."
    cp /Users/alexgeo/.cursor/worktrees/event-venue-buzau/yue/app/admin/page.tsx /Users/alexgeo/event-venue-buzau/app/admin/page.tsx 2>/dev/null || true
    echo "✅ Fișier sincronizat!"
fi

# 2. Omoară TOATE procesele Node.js
echo "⏹️  Oprire procese Node.js..."
pkill -9 node 2>/dev/null || true
sleep 2

# 3. Verifică și eliberează portul 3000
echo "🔓 Eliberare port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# 4. Curățare cache-uri
echo "🗑️  Curățare cache-uri..."
cd /Users/alexgeo/event-venue-buzau || { echo "❌ Eroare: Nu pot accesa ROOT!"; exit 1; }
rm -rf .next .turbo node_modules/.cache 2>/dev/null || true

# 5. Pornire server
echo ""
echo "🚀 Pornire server..."
npm run dev
