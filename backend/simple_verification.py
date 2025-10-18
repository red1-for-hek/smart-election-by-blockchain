#!/usr/bin/env python3
"""
Simple Vote Verification System - No Face Recognition
Just captures NID and face photos for manual verification
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
import base64
import os
from datetime import datetime

app = FastAPI()

# Create verification directories
os.makedirs("verification_data/nid_scans", exist_ok=True)
os.makedirs("verification_data/face_verification", exist_ok=True)

# Simple verification status
verification_status = {
    "nid_front": False,
    "nid_back": False,
    "face_verified": False,
    "vote_enabled": False
}

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
<!DOCTYPE html>
<html>
<head>
    <title>Vote Verification - Bangladesh Election</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
            background: linear-gradient(135deg, #006747, #00a86b);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.95);
            color: #333;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 { color: #006747; text-align: center; }
        .step {
            background: #f8f9fa;
            padding: 20px;
            margin: 15px 0;
            border-radius: 10px;
            border-left: 5px solid #006747;
        }
        .step.completed {
            background: #d4edda;
            border-left-color: #28a745;
        }
        video {
            width: 100%;
            max-width: 500px;
            border: 3px solid #006747;
            border-radius: 10px;
            margin: 15px 0;
            display: block;
        }
        button {
            background: #006747;
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            margin: 8px 5px;
            transition: all 0.3s;
        }
        button:hover { background: #004d33; transform: translateY(-2px); }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .status {
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-weight: bold;
        }
        .success { background: #d4edda; color: #155724; }
        .info { background: #d1ecf1; color: #0c5460; }
        .warning { background: #fff3cd; color: #856404; }
        .error { background: #f8d7da; color: #721c24; }
        .verification-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .vote-button {
            background: #28a745;
            font-size: 20px;
            padding: 20px 40px;
            border-radius: 10px;
            display: block;
            margin: 30px auto;
            text-align: center;
        }
        .checkmark {
            color: #28a745;
            font-size: 24px;
            font-weight: bold;
        }
        .camera-container {
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗳️ ভোট যাচাইকরণ সিস্টেম</h1>
        <h2 style="text-align: center; color: #666;">Vote Verification System</h2>
        
        <div class="verification-grid">
            <div>
                <div id="step1" class="step">
                    <h3>১. এনআইডি সামনের অংশ স্ক্যান করুন</h3>
                    <p>Scan NID Front Side</p>
                    <button onclick="setMode('nid_front')">📇 NID Front</button>
                    <span id="nid_front_status"></span>
                </div>
                
                <div id="step2" class="step">
                    <h3>২. এনআইডি পিছনের অংশ স্ক্যান করুন</h3>
                    <p>Scan NID Back Side</p>
                    <button onclick="setMode('nid_back')">📇 NID Back</button>
                    <span id="nid_back_status"></span>
                </div>
            </div>
            
            <div>
                <div id="step3" class="step">
                    <h3>৩. মুখ যাচাইকরণ</h3>
                    <p>Face Verification</p>
                    <button onclick="setMode('face')">👤 Face Verify</button>
                    <span id="face_status"></span>
                </div>
            </div>
        </div>

        <div id="status" class="status info">ক্যামেরা শুরু করা হচ্ছে... / Starting camera...</div>

        <div class="camera-container">
            <video id="video" autoplay playsinline muted></video>
            <canvas id="canvas" style="display:none;"></canvas>
        </div>

        <div style="text-align: center;">
            <button id="captureBtn" onclick="capturePhoto()">📸 Capture</button>
        </div>

        <button id="voteBtn" class="vote-button" onclick="proceedToVote()" style="display:none;">
            🗳️ ভোট দিন / CAST VOTE
        </button>
    </div>

    <script>
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let currentMode = 'nid_front';
        let stream = null;

        // Enhanced camera initialization
        async function startCamera() {
            try {
                showStatus('ক্যামেরা অ্যাক্সেস চাওয়া হচ্ছে... / Requesting camera access...', 'info');
                
                const constraints = {
                    video: {
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        facingMode: 'user'
                    },
                    audio: false
                };

                stream = await navigator.mediaDevices.getUserMedia(constraints);
                video.srcObject = stream;
                
                // Wait for video to load
                video.onloadedmetadata = () => {
                    video.play().then(() => {
                        showStatus('✅ ক্যামেরা প্রস্তুত / Camera ready!', 'success');
                    }).catch(err => {
                        console.error('Play error:', err);
                        showStatus('❌ ভিডিও চালু করতে সমস্যা / Video play error', 'error');
                    });
                };

                video.onerror = (err) => {
                    console.error('Video error:', err);
                    showStatus('❌ ভিডিও লোড করতে সমস্যা / Video load error', 'error');
                };

            } catch (err) {
                console.error('Camera error:', err);
                showStatus('❌ ক্যামেরা অ্যাক্সেস অস্বীকৃত / Camera access denied: ' + err.message, 'error');
            }
        }

        function setMode(mode) {
            currentMode = mode;
            
            if (mode === 'nid_front') {
                showStatus('📇 এনআইডি সামনের অংশ রাখুন / Place NID front side', 'info');
            } else if (mode === 'nid_back') {
                showStatus('📇 এনআইডি পিছনের অংশ রাখুন / Place NID back side', 'info');
            } else {
                showStatus('👤 ক্যামেরার দিকে তাকান / Look at camera', 'info');
            }
        }

        function showStatus(message, type) {
            let status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
        }

        async function capturePhoto() {
            if (!video.videoWidth || !video.videoHeight) {
                showStatus('❌ ক্যামেরা প্রস্তুত নয় / Camera not ready', 'error');
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            let imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            try {
                let response = await fetch('/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: imageData,
                        mode: currentMode
                    })
                });
                
                let result = await response.json();
                
                if (result.success) {
                    showStatus('✅ ' + result.message, 'success');
                    updateStepStatus(currentMode, true);
                    checkAllStepsComplete();
                } else {
                    showStatus('❌ ' + result.message, 'error');
                }
            } catch (err) {
                showStatus('❌ Error: ' + err.message, 'error');
            }
        }

        function updateStepStatus(step, completed) {
            let statusElement = document.getElementById(step + '_status');
            if (completed) {
                statusElement.innerHTML = '<span class="checkmark">✓</span>';
                let stepNum = step === 'nid_front' ? '1' : step === 'nid_back' ? '2' : '3';
                document.getElementById('step' + stepNum).classList.add('completed');
            }
        }

        function checkAllStepsComplete() {
            fetch('/status')
            .then(response => response.json())
            .then(data => {
                if (data.vote_enabled) {
                    document.getElementById('voteBtn').style.display = 'block';
                    showStatus('🎉 সব যাচাইকরণ সম্পন্ন! ভোট দিতে পারেন / All verification completed! You can vote now!', 'success');
                }
            });
        }

        function proceedToVote() {
            window.open('http://localhost:5173', '_blank');
        }

        // Initialize camera on page load
        window.addEventListener('load', () => {
            startCamera();
            setMode('nid_front');
        });
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
    
    if mode in ['nid_front', 'nid_back']:
        filename = f"{mode}_{timestamp}.jpg"
        filepath = os.path.join("verification_data/nid_scans", filename)
    else:
        filename = f"face_verify_{timestamp}.jpg"
        filepath = os.path.join("verification_data/face_verification", filename)
    
    # Save image
    with open(filepath, 'wb') as f:
        f.write(image_bytes)
    
    # Update verification status
    if mode == 'nid_front':
        verification_status['nid_front'] = True
        message = "এনআইডি সামনের অংশ সংরক্ষিত / NID front saved"
    elif mode == 'nid_back':
        verification_status['nid_back'] = True
        message = "এনআইডি পিছনের অংশ সংরক্ষিত / NID back saved"
    else:
        verification_status['face_verified'] = True
        message = "মুখের ছবি সংরক্ষিত / Face photo saved"
    
    # Check if all steps completed
    verification_status['vote_enabled'] = (
        verification_status['nid_front'] and 
        verification_status['nid_back'] and 
        verification_status['face_verified']
    )
    
    return JSONResponse({
        "success": True,
        "message": message,
        "filepath": filepath
    })

@app.get("/status")
async def get_status():
    return JSONResponse(verification_status)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)