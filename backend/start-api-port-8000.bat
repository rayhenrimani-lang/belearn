@echo off
echo Starting Symfony API on port 8000...
cd /d "c:\xampp\htdocs\backend"
php -S 0.0.0.0:8000 -t public
pause
