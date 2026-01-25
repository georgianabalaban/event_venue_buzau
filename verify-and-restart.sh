#!/bin/bash

# Script pentru verificare și restart sigur
# Folosește acest script după fiecare modificare!

echo "🔍 Verificare căi fișiere..."

# Verifică dacă există diferențe între worktree și ROOT
if [ -f "/Users/alexgeo/.cursor/worktrees/event-venue-buzau/yue/app/admin/page.tsx" ]; then
    echo "⚠️  Worktree detectat! Sincronizare..."
    cp /Users/alexgeo/.cursor/worktrees/event-venue-buzau/yue/app/admin/page.tsx /Users/alexgeo/event-venue-buzau/app/admin/page.tsx
    echo "✅ Fișier sincronizat!"
fi

echo "🧹 Curățare procese..."
pkill -9 node 2>/dev/null
sleep 2

echo "🗑️  Ștergere cache..."
cd /Users/alexgeo/event-venue-buzau
rm -rf .next .turbo node_modules/.cache

echo "🚀 Pornire server..."
npm run dev

