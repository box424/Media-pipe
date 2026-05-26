@echo off
REM 簡單服務器啟動腳本 (Windows)

echo ==================================================
echo   Media Pipe 表情辨識應用 - 本地測試服務器
echo ==================================================
echo.

REM 檢查Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 找到 Python
    echo 正在啟動服務器在 http://localhost:8000
    echo 按 Ctrl+C 停止服務器
    echo.
    python -m http.server 8000
    exit /b 0
)

where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 找到 Python3
    echo 正在啟動服務器在 http://localhost:8000
    echo 按 Ctrl+C 停止服務器
    echo.
    python3 -m http.server 8000
    exit /b 0
)

REM 檢查Node.js http-server
where http-server >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 找到 http-server
    echo 正在啟動服務器在 http://localhost:8000
    echo 按 Ctrl+C 停止服務器
    echo.
    http-server -p 8000
    exit /b 0
)

REM 檢查Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 找到 Node.js
    echo 正在啟動簡單HTTP服務器...
    echo.
    
    REM 創建簡單的Node.js服務器
    (
        echo const http = require('http');
        echo const fs = require('fs');
        echo const path = require('path');
        echo.
        echo const PORT = 8000;
        echo.
        echo const server = http.createServer((req, res) =^> {
        echo     let filePath = '.' + req.url;
        echo     if (filePath === './') {
        echo         filePath = './index.html';
        echo     }
        echo.
        echo     fs.readFile(filePath, (err, content) =^> {
        echo         if (err) {
        echo             res.writeHead(404);
        echo             res.end('404 Not Found');
        echo         } else {
        echo             let contentType = 'text/html';
        echo             if (filePath.endsWith('.css')) contentType = 'text/css';
        echo             if (filePath.endsWith('.js')) contentType = 'application/javascript';
        echo             
        echo             res.writeHead(200, { 'Content-Type': contentType });
        echo             res.end(content);
        echo         }
        echo     });
        echo });
        echo.
        echo server.listen(PORT, () =^> {
        echo     console.log(`服務器運行在 http://localhost:${PORT}`);
        echo     console.log('按 Ctrl+C 停止服務器');
        echo });
    ) > temp_server.js
    
    node temp_server.js
    del temp_server.js
    exit /b 0
)

echo ✗ 未找到任何Web服務器
echo.
echo 請安裝以下其中之一：
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo   - http-server: npm install -g http-server
