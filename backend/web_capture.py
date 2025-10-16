#!/usr/bin/env python3
"""
Web-based photo capture for GitHub Codespaces
Run this and open the URL in your browser
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import base64
import os
from datetime import datetime

app = FastAPI()

# Create output directories
os.makedirs("training_data/nid", exist_ok=True)
os.makedirs("training_data/faces", exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
<!DOCTYPE html>
<html>
<head>
    <title>Photo Capture - Bangladesh Voting System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #006747; }
        video {
            width: 100%;
            max-width: 640px;
            border: 3px solid #006747;
            border-radius: 10px;
            margin: 20px 0;
        }
        button {
            background: #006747;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
        }
        button:hover { background: #004d33; }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .status {
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .success { background: #d4edda; color: #155724; }
        .info { background: #d1ecf1; color: #0c5460; }
        .warning { background: #fff3cd; color: #856404; }
        .counter {
            font-size: 24px;
            font-weight: bold;
            color: #006747;
            margin: 20px 0;
        }
        .guide {
            background: #e7f3ff;
            padding: 15px;
            border-left: 4px solid #006747;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Training Photo Capture</h1>
        <p>Capture photos for training the verification system</p>
        
        <div class="guide">
            <strong>Instructions:</strong>
            <ul>
                <li><strong>NID Mode:</strong> Place your NID card in view and click capture</li>
                <li><strong>Face Mode:</strong> Look at camera, click "Start Auto Capture" for 30 photos</li>
                <li>Move your head slightly between captures for better accuracy</li>
            </ul>
        </div>

        <div>
            <button onclick="switchMode('nid')">📇 NID Mode</button>
            <button onclick="switchMode('face')">👤 Face Mode</button>
        </div>

        <div id="status" class="status info" style="display:none;"></div>
        <div id="counter" class="counter" style="display:none;"></div>

        <video id="video" autoplay playsinline></video>
        <canvas id="canvas" style="display:none;"></canvas>

        <div>
            <button id="captureBtn" onclick="capturePhoto()">📸 Capture Photo</button>
            <button id="autoBtn" onclick="startAutoCapture()" style="display:none;">🎬 Start Auto Capture (30 photos)</button>
            <button id="stopBtn" onclick="stopAutoCapture()" style="display:none;">⏹️ Stop</button>
        </div>

        <div id="results" style="margin-top: 20px;"></div>
    </div>

    <script>
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let mode = 'face';
        let autoCapturing = false;
        let captureCount = 0;
        let autoInterval;

        // Start camera
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        })
        .then(stream => {
            video.srcObject = stream;
            showStatus('✅ Camera ready!', 'success');
        })
        .catch(err => {
            showStatus('❌ Camera access denied: ' + err.message, 'warning');
        });

        function switchMode(newMode) {
            mode = newMode;
            captureCount = 0;
            stopAutoCapture();
            
            if (mode === 'nid') {
                document.getElementById('captureBtn').style.display = 'inline-block';
                document.getElementById('autoBtn').style.display = 'none';
                showStatus('📇 NID Mode: Place your NID card in view', 'info');
            } else {
                document.getElementById('captureBtn').style.display = 'none';
                document.getElementById('autoBtn').style.display = 'inline-block';
                showStatus('👤 Face Mode: Click "Start Auto Capture"', 'info');
            }
        }

        function showStatus(message, type) {
            let status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
        }

        function updateCounter() {
            let counter = document.getElementById('counter');
            counter.textContent = `Photos captured: ${captureCount}`;
            counter.style.display = 'block';
        }

        async function capturePhoto() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            let imageData = canvas.toDataURL('image/jpeg');
            
            try {
                let response = await fetch('/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: imageData,
                        mode: mode
                    })
                });
                
                let result = await response.json();
                
                if (result.success) {
                    captureCount++;
                    updateCounter();
                    showStatus('✅ ' + result.message, 'success');
                } else {
                    showStatus('❌ ' + result.message, 'warning');
                }
            } catch (err) {
                showStatus('❌ Error: ' + err.message, 'warning');
            }
        }

        function startAutoCapture() {
            if (autoCapturing) return;
            
            autoCapturing = true;
            captureCount = 0;
            document.getElementById('autoBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'inline-block';
            
            showStatus('🎬 Auto-capturing... Move your head slightly!', 'info');
            
            // Capture immediately
            capturePhoto();
            
            // Then capture every 1 second
            autoInterval = setInterval(() => {
                if (captureCount >= 30) {
                    stopAutoCapture();
                    showStatus('✅ Auto-capture complete! 30 photos saved.', 'success');
                } else {
                    capturePhoto();
                }
            }, 1000);
        }

        function stopAutoCapture() {
            autoCapturing = false;
            clearInterval(autoInterval);
            document.getElementById('autoBtn').style.display = 'inline-block';
            document.getElementById('stopBtn').style.display = 'none';
        }

        // Initialize in face mode
        switchMode('face');
    </script>
</body>
</html>
    """

@app.post("/capture")
async def capture(request: Request):
    data = await request.json()
    image_data = data['image']
    mode = data['mode']
    
    # Remove data URL prefix
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    # Decode base64
    image_bytes = base64.b64decode(image_data)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    
    if mode == 'nid':
        filename = f"nid_{timestamp}.jpg"
        filepath = os.path.join("training_data/nid", filename)
    else:
        # Count existing face photos
        face_files = [f for f in os.listdir("training_data/faces") if f.endswith('.jpg')]
        count = len(face_files) + 1
        filename = f"face_{count:03d}_{timestamp}.jpg"
        filepath = os.path.join("training_data/faces", filename)
    
    # Save image
    with open(filepath, 'wb') as f:
        f.write(image_bytes)
    
    return JSONResponse({
        "success": True,
        "message": f"Saved: {filename}",
        "filepath": filepath
    })

@app.get("/status")
async def status():
    nid_count = len([f for f in os.listdir("training_data/nid") if f.endswith('.jpg')])
    face_count = len([f for f in os.listdir("training_data/faces") if f.endswith('.jpg')])
    
    return {
        "nid_photos": nid_count,
        "face_photos": face_count,
        "ready_to_train": nid_count >= 1 and face_count >= 10
    }

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🎥 Web-Based Photo Capture Server")
    print("="*60)
    print("\n📸 Starting server...")
    print("\n🌐 Open this URL in your browser:")
    print("   http://localhost:8001")
    print("\n📝 Instructions:")
    print("   1. Allow camera access in browser")
    print("   2. Switch between NID and Face mode")
    print("   3. Capture photos")
    print("\n⏹️  Press Ctrl+C to stop")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)
