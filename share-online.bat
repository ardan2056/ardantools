@echo off
title Share Ardan Tools ke Publik (Bisa Diakses Orang Lain)
echo ========================================================
echo   Membuka Akses Publik agar bisa diakses semua orang...
echo ========================================================
echo Pastikan server lokal sedang berjalan (start-server.bat).
echo Membuat link publik gratis...
npx --yes localtunnel --port 4000
pause
