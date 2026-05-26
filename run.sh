#!/bin/bash

# 簡單服務器啟動腳本
# 支援多種Web服務器

echo "=================================================="
echo "  Media Pipe 表情辨識應用 - 本地測試服務器"
echo "=================================================="
echo ""

# 檢查Python
if command -v python3 &> /dev/null; then
    echo "✓ 找到 Python3"
    echo "正在啟動服務器在 http://localhost:8000"
    echo "按 Ctrl+C 停止服務器"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8000
    exit 0
fi

# 檢查Node.js http-server
if command -v http-server &> /dev/null; then
    echo "✓ 找到 http-server"
    echo "正在啟動服務器在 http://localhost:8000"
    echo "按 Ctrl+C 停止服務器"
    echo ""
    cd "$(dirname "$0")"
    http-server -p 8000
    exit 0
fi

# 檢查Node.js
if command -v node &> /dev/null; then
    echo "✓ 找到 Node.js"
    echo "正在啟動簡單HTTP服務器..."
    echo ""
    
    
    # 創建簡單的Node.js服務器
    cat > temp_server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) contentType = 'text/css';
            if (filePath.endsWith('.js')) contentType = 'application/javascript';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`服務器運行在 http://localhost:${PORT}`);
    console.log('按 Ctrl+C 停止服務器');
});
EOF

    node temp_server.js
    rm temp_server.js
    exit 0
fi

echo "✗ 未找到任何Web服務器"
echo ""
echo "請安裝以下其中之一："
echo "  - Python3: https://www.python.org/downloads/"
echo "  - Node.js: https://nodejs.org/"
echo "  - http-server: npm install -g http-server"
