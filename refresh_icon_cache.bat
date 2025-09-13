@echo off
echo 正在刷新Windows图标缓存...
taskkill /f /im explorer.exe
timeout /t 2
del /a /q "%localappdata%\IconCache.db"
del /a /f /q "%localappdata%\Microsoft\Windows\Explorer\iconcache*"
start explorer.exe
echo 图标缓存已刷新，请检查应用程序图标
pause
