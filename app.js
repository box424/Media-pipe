// 全局變量
let video, canvas, ctx;
let isRunning = false;
let emotionHistory = [];
let lastEmotionTime = 0;
const EMOTION_COOLDOWN = 2000; // 2秒冷卻時間
let modelsLoaded = false;

// 表情配置
const EMOTIONS = {
    neutral: { emoji: '😐', name: '中立', color: '#6c757d' },
    happy: { emoji: '😊', name: '開心', color: '#ffc107' },
    sad: { emoji: '😢', name: '難過', color: '#0099ff' },
    angry: { emoji: '😠', name: '生氣', color: '#ff4444' },
    surprised: { emoji: '😲', name: '驚訝', color: '#ff99cc' },
    fearful: { emoji: '😨', name: '害怕', color: '#9966ff' },
    disgusted: { emoji: '🤮', name: '厭惡', color: '#339933' }
};

const VOICE_FEEDBACK = {
    happy: '太好了！你看起來很開心',
    sad: '別難過，一切都會好起來的',
    angry: '冷靜下來，深呼吸',
    surprised: '哇，發生了什麼驚人的事嗎',
    fearful: '不用害怕，你很安全',
    disgusted: '一切都會好起來的',
    neutral: '你現在看起來很平靜'
};

// 初始化
async function init() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // 設置canvas大小
    canvas.width = 640;
    canvas.height = 480;

    // 加載 face-api 模型
    try {
        await loadModels();
        modelsLoaded = true;
        console.log('模型加載成功');
    } catch (error) {
        console.error('模型加載失敗:', error);
        alert('表情識別模型加載失敗。請刷新頁面重試。');
        return;
    }

    // 綁定事件監聽
    document.getElementById('startBtn').addEventListener('click', startCamera);
    document.getElementById('stopBtn').addEventListener('click', stopCamera);
    document.getElementById('voiceFeedbackToggle').addEventListener('change', toggleVoiceFeedback);
    document.getElementById('showCanvasToggle').addEventListener('change', toggleCanvas);
    document.getElementById('confidenceSlider').addEventListener('input', updateConfidenceValue);

    updateUI('stop');
}

// 加載 face-api 模型
async function loadModels() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
}

// 啟動相機
async function startCamera() {
    if (!modelsLoaded) {
        alert('模型尚未加載完成，請稍候...');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });

        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };

        isRunning = true;
        updateUI('start');
        detectEmotions();
    } catch (error) {
        console.error('無法訪問攝影機:', error);
        alert('無法訪問攝影機。請檢查權限和設備。');
    }
}

// 停止相機
function stopCamera() {
    isRunning = false;
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateUI('stop');
}

// 表情檢測主循環
async function detectEmotions() {
    if (!isRunning) return;

    try {
        // 執行臉部檢測和表情識別
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        // 清除畫布
        if (document.getElementById('showCanvasToggle').checked) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'block';
            
            // 繪製檢測結果
            const resized = faceapi.resizeResults(detections, {
                width: canvas.width,
                height: canvas.height
            });
            
            faceapi.draw.drawDetections(canvas, resized);
            faceapi.draw.drawFaceLandmarks(canvas, resized);
        } else {
            canvas.style.display = 'none';
        }

        if (detections.length > 0) {
            document.getElementById('faceDetected').textContent = '✓ 已檢測到';
            
            // 獲取表情數據
            const expressions = detections[0].expressions;
            const emotion = analyzeEmotion(expressions);
            updateEmotionDisplay(emotion);
        } else {
            document.getElementById('faceDetected').textContent = '✗ 未檢測到';
            updateEmotionDisplay(null);
        }
    } catch (error) {
        console.error('表情檢測錯誤:', error);
    }

    requestAnimationFrame(detectEmotions);
}

// 分析表情（基於face-api的表情識別）
function analyzeEmotion(expressions) {
    if (!expressions || typeof expressions !== 'object') {
        return null;
    }

    // face-api 返回的表情列表
    const emotionMap = {
        'neutral': 'neutral',
        'happy': 'happy',
        'sad': 'sad',
        'angry': 'angry',
        'fearful': 'fearful',
        'disgusted': 'disgusted',
        'surprised': 'surprised'
    };

    // 找出得分最高的表情
    let maxEmotion = 'neutral';
    let maxScore = 0;

    Object.keys(expressions).forEach(key => {
        if (expressions[key] > maxScore) {
            maxScore = expressions[key];
            maxEmotion = emotionMap[key] || 'neutral';
        }
    });

    // 信心度是百分比
    const confidence = Math.round(maxScore * 100);

    return {
        emotion: maxEmotion,
        confidence: confidence,
        scores: expressions
    };
}

// 更新表情顯示
function updateEmotionDisplay(emotionResult) {
    const now = Date.now();
    
    if (emotionResult === null) {
        document.getElementById('emotionName').textContent = '偵測中...';
        document.getElementById('emotionEmoji').textContent = '😐';
        document.getElementById('emotionConfidence').textContent = '信心度: 0%';
        document.getElementById('currentEmotion').textContent = '-';
        return;
    }

    const emotion = emotionResult.emotion;
    const confidence = Math.round(emotionResult.confidence);
    const confidenceThreshold = parseFloat(document.getElementById('confidenceSlider').value);

    if (confidence >= confidenceThreshold * 100) {
        const emotionData = EMOTIONS[emotion];
        document.getElementById('emotionEmoji').textContent = emotionData.emoji;
        document.getElementById('emotionName').textContent = emotionData.name;
        document.getElementById('emotionConfidence').textContent = `信心度: ${confidence}%`;
        document.getElementById('currentEmotion').textContent = emotionData.name;

        // 觸發語音回饋（帶冷卻時間）
        if (now - lastEmotionTime > EMOTION_COOLDOWN && document.getElementById('voiceFeedbackToggle').checked) {
            speakEmotion(emotion);
            lastEmotionTime = now;
            addToHistory(emotion, emotionData.emoji);
        }
    }
}

// 語音回饋
function speakEmotion(emotion) {
    if (!('speechSynthesis' in window)) {
        console.warn('此瀏覽器不支援語音合成');
        return;
    }

    const text = VOICE_FEEDBACK[emotion] || '你現在看起來很平靜';
    const utterance = new SpeechSynthesisUtterance(text);

    // 設置語音參數
    utterance.lang = 'zh-TW'; // 繁體中文
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // 停止現有的語音
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

// 添加到歷史記錄
function addToHistory(emotion, emoji) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-TW');

    emotionHistory.unshift({
        emotion: emotion,
        emoji: emoji,
        time: timeStr
    });

    // 只保留最近20條記錄
    if (emotionHistory.length > 20) {
        emotionHistory.pop();
    }

    updateHistoryDisplay();
}

// 更新歷史記錄顯示
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('emotionHistory');
    historyContainer.innerHTML = emotionHistory.map(item => `
        <div class="history-item">
            <div class="history-emoji">${item.emoji}</div>
            <div>${EMOTIONS[item.emotion].name}</div>
            <div class="history-time">${item.time}</div>
        </div>
    `).join('');
}

// 切換語音回饋
function toggleVoiceFeedback() {
    const enabled = document.getElementById('voiceFeedbackToggle').checked;
    document.getElementById('voiceFeedbackStatus').textContent = enabled ? '已啟用' : '已禁用';
}

// 切換顯示檢測框
function toggleCanvas() {
    canvas.style.display = document.getElementById('showCanvasToggle').checked ? 'block' : 'none';
}

// 更新信心度值顯示
function updateConfidenceValue() {
    document.getElementById('confidenceValue').textContent = 
        document.getElementById('confidenceSlider').value;
}

// 更新UI狀態
function updateUI(state) {
    if (state === 'start') {
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('detectionStatus').textContent = '✓ 進行中';
    } else {
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('detectionStatus').textContent = '✗ 已停止';
        document.getElementById('faceDetected').textContent = '未檢測到';
    }
}

// 使用 face-api.js 進行表情識別

// 在頁面加載時初始化
window.addEventListener('load', async () => {
    // 等待 face-api 腳本加載
    if (typeof faceapi !== 'undefined') {
        // 如果 face-api 已加載，初始化應用
        await init();
    } else {
        // 否則等待加載
        setTimeout(() => {
            if (typeof faceapi !== 'undefined') {
                init();
            } else {
                alert('表情識別庫加載失敗，請刷新頁面重試');
            }
        }, 3000);
    }
});

// 頁面卸載時清理
window.addEventListener('beforeunload', () => {
    if (isRunning) {
        stopCamera();
    }
});
