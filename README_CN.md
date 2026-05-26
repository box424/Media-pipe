# 📊 Media Pipe 表情辨識應用

一個純前端網頁應用，使用 face-api.js 進行實時表情辨識，並提供語音回饋功能。

## 🎯 功能特性

- ✅ **實時表情辨識** - 使用AI模型識別7種基本表情
  - 😊 開心 (Happy)
  - 😢 難過 (Sad)
  - 😠 生氣 (Angry)
  - 😲 驚訝 (Surprised)
  - 😨 害怕 (Fearful)
  - 🤮 厭惡 (Disgusted)
  - 😐 中立 (Neutral)

- 🎤 **語音回饋** - 根據檢測到的表情提供語音反應（繁體中文）

- 📹 **攝影機集成** - 支援瀏覽器攝影機直接訪問

- 🎨 **實時視覺化** - 即時顯示面部檢測框和關鍵點

- 📊 **表情歷史** - 記錄近期檢測到的表情

- ⚙️ **靈活設定** - 可調整信心度閾值、語音開關、檢測框顯示

## 🚀 快速開始

### 方式1：直接打開HTML文件
```bash
# 由於涉及攝影機訪問，需要通過HTTP(S)服務
# 直接打開文件會受到安全限制
```

### 方式2：使用Python本地服務器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然後在瀏覽器中訪問：`http://localhost:8000`

### 方式3：使用Node.js http-server
```bash
# 先安裝
npm install -g http-server

# 運行
http-server -p 8000
```

### 方式4：使用VS Code Live Server
1. 安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴展
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

## 📋 系統需求

- 現代瀏覽器（支援WebRTC和WebGL）
  - Chrome/Edge 60+
  - Firefox 60+
  - Safari 11+
  
- 攝影機/麥克風硬件
- HTTPS連接（某些瀏覽器要求；localhost例外）

## 🎮 使用方法

1. **啟動應用** - 點擊「開啟相機」按鈕
2. **允許權限** - 允許瀏覽器訪問攝影機和麥克風
3. **面向攝影機** - 在攝影機前放鬆表達你的表情
4. **實時反饋** - 應用會：
   - 顯示識別到的表情和信心度
   - 播放對應的語音反饋
   - 記錄表情到歷史記錄

## ⚙️ 設定選項

| 設定 | 說明 |
|-----|------|
| 啟用語音回饋 | 切換語音反應功能 |
| 顯示偵測框 | 顯示/隱藏面部檢測視覺化 |
| 信心度閾值 | 調整表情識別的精度（0.3-0.9） |

## 📊 表情識別工作原理

1. **面部檢測** - 使用 TinyFaceDetector 檢測視頻中的面部
2. **關鍵點定位** - 使用 FaceLandmark68Net 定位68個面部關鍵點
3. **表情分類** - 使用 FaceExpressionNet 神經網絡分類表情
4. **信心度評分** - 返回每種表情的置信度分數

## 🔌 技術棧

- **前端框架** - 純HTML5 + CSS3 + JavaScript (ES6)
- **表情識別** - [face-api.js](https://github.com/vladmandic/face-api) 
  - TinyFaceDetector (快速面部檢測)
  - FaceLandmark68Net (關鍵點檢測)
  - FaceExpressionNet (表情分類)
- **語音合成** - 瀏覽器 Web Speech API
- **視頻處理** - WebRTC MediaStream

## 🐛 常見問題

### Q: 攝影機無法訪問？
A: 確保：
- 瀏覽器獲得了攝影機權限
- 你的網站在 HTTPS 上（或 localhost）
- 防火牆未阻止攝影機訪問

### Q: 表情識別不準確？
A: 
- 確保光線充足
- 調整信心度閾值以降低誤報
- 保持穩定的頭部位置
- 面部完全可見於攝影機

### Q: 語音反饋無聲音？
A: 
- 檢查瀏覽器音量設定
- 確認「啟用語音回饋」選項已勾選
- 檢查系統音量
- 某些語言/瀏覽器組合可能不支援

### Q: 模型加載很慢？
A: 
- face-api 模型需要從CDN下載（首次需要幾秒）
- 後續訪問會使用緩存
- 確保網絡連接穩定

## 📝 文件結構

```
Media-pipe/
├── index.html          # 主HTML頁面
├── styles.css          # 樣式表
├── app.js              # 應用邏輯和事件處理
└── README.md           # 本文件
```

## 🔐 隱私考量

- 此應用完全運行在客戶端，無數據上傳
- 攝影機流只用於本地處理
- 未記錄任何個人數據

## 📄 許可證

此項目為開源項目，可自由使用和修改。

## 🙏 致謝

- [face-api.js](https://github.com/vladmandic/face-api) - 面部檢測和表情識別庫
- [TensorFlow.js](https://www.tensorflow.org/js) - 機器學習基礎

## 📞 支援

如有問題或建議，歡迎提交issue或pull request。

---

**提示：** 為了獲得最佳體驗，建議在光線充足的環境中使用，並確保攝影機清晰度良好。
