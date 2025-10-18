#!/usr/bin/env python3
"""
Vote Verification System - NID Scan + Face Verification
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
import base64
import os
import cv2
import numpy as np
from datetime import datetime
import face_recognition

app = FastAPI()

# Create verification directories
os.makedirs("verification_data/nid_scans", exist_ok=True)
os.makedirs("verification_data/face_verification", exist_ok=True)

# Load training data
def load_training_encodings():
    """Load face encodings from training data"""
    encodings = []
    training_path = "training_data/faces"
    
    if os.path.exists(training_path):
        for filename in os.listdir(training_path):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(training_path, filename)
                image = face_recognition.load_image_file(image_path)
                face_encodings = face_recognition.face_encodings(image)
                if face_encodings:
                    encodings.append(face_encodings[0])
    
    return encodings

# Global variables
TRAINING_ENCODINGS = load_training_encodings()
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
        .face-instructions {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
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
                    
                    <div class="face-instructions" id="face_instructions" style="display:none;">
                        <strong>নির্দেশনা / Instructions:</strong>
                        <ul>
                            <li>সোজা তাকান / Look straight</li>
                            <li>বাম দিকে মুখ ঘুরান / Turn left</li>
                            <li>ডান দিকে মুখ ঘুরান / Turn right</li>
                            <li>উপরে তাকান / Look up</li>
                            <li>নিচে তাকান / Look down</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="status" class="status info" style="display:none;"></div>

        <video id="video" autoplay playsinline style="display:block; margin: 20px auto;"></video>
        <canvas id="canvas" style="display:none;"></canvas>

        <div style="text-align: center;">
            <button id="captureBtn" onclick="capturePhoto()">📸 Capture</button>
            <button id="verifyBtn" onclick="startFaceVerification()" style="display:none;">✅ Start Verification</button>
        </div>

        <button id="voteBtn" class="vote-button" onclick="proceedToVote()" style="display:none;">
            🗳️ ভোট দিন / CAST VOTE
        </button>

        <div id="results" style="margin-top: 20px;"></div>
    </div>

    <script>
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let currentMode = 'nid_front';
        let faceVerificationStep = 0;
        let faceSteps = ['center', 'left', 'right', 'up', 'down'];
        let faceStepNames = ['সোজা তাকান', 'বাম দিকে তাকান', 'ডান দিকে তাকান', 'উপরে তাকান', 'নিচে তাকান'];

        // Start camera
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        })
        .then(stream => {
            video.srcObject = stream;
            showStatus('✅ ক্যামেরা প্রস্তুত / Camera ready!', 'success');
        })
        .catch(err => {
            showStatus('❌ ক্যামেরা অ্যাক্সেস অস্বীকৃত / Camera access denied: ' + err.message, 'error');
        });

        function setMode(mode) {
            currentMode = mode;
            faceVerificationStep = 0;
            
            if (mode === 'face') {
                document.getElementById('face_instructions').style.display = 'block';
                document.getElementById('captureBtn').style.display = 'none';
                document.getElementById('verifyBtn').style.display = 'inline-block';
                showStatus('👤 মুখ যাচাইকরণ মোড / Face verification mode', 'info');
            } else {
                document.getElementById('face_instructions').style.display = 'none';
                document.getElementById('captureBtn').style.display = 'inline-block';
                document.getElementById('verifyBtn').style.display = 'none';
                
                if (mode === 'nid_front') {
                    showStatus('📇 এনআইডি সামনের অংশ রাখুন / Place NID front side', 'info');
                } else {
                    showStatus('📇 এনআইডি পিছনের অংশ রাখুন / Place NID back side', 'info');
                }
            }
        }

        function showStatus(message, type) {
            let status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
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

        async function startFaceVerification() {
            faceVerificationStep = 0;
            showNextFaceStep();
        }

        function showNextFaceStep() {
            if (faceVerificationStep < faceSteps.length) {
                let stepName = faceStepNames[faceVerificationStep];
                showStatus(`👤 ${stepName} / ${faceSteps[faceVerificationStep].toUpperCase()}`, 'info');
                
                setTimeout(() => {
                    captureFaceStep();
                }, 3000); // 3 seconds to position
            }
        }

        async function captureFaceStep() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            let imageData = canvas.toDataURL('image/jpeg');
            
            try {
                let response = await fetch('/verify_face', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: imageData,
                        step: faceSteps[faceVerificationStep]
                    })
                });
                
                let result = await response.json();
                
                if (result.success) {
                    faceVerificationStep++;
                    if (faceVerificationStep < faceSteps.length) {
                        showStatus('✅ ধাপ সম্পন্ন / Step completed', 'success');
                        setTimeout(showNextFaceStep, 1000);
                    } else {
                        showStatus('✅ মুখ যাচাইকরণ সম্পন্ন / Face verification completed!', 'success');
                        updateStepStatus('face', true);
                        checkAllStepsComplete();
                    }
                } else {
                    showStatus('❌ ' + result.message, 'error');
                    faceVerificationStep = 0; // Restart
                    setTimeout(showNextFaceStep, 2000);
                }
            } catch (err) {
                showStatus('❌ Error: ' + err.message, 'error');
            }
        }

        function updateStepStatus(step, completed) {
            let statusElement = document.getElementById(step + '_status');
            if (completed) {
                statusElement.innerHTML = '<span class="checkmark">✓</span>';
                document.getElementById('step' + (step === 'nid_front' ? '1' : step === 'nid_back' ? '2' : '3')).classList.add('completed');
            }
        }

        function checkAllStepsComplete() {
            // Check if all steps are completed
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
            // Redirect to vote page
            window.location.href = '/vote';
        }

        // Initialize
        setMode('nid_front');
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
    filename = f"{mode}_{timestamp}.jpg"
    filepath = os.path.join("verification_data/nid_scans", filename)
    
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
    
    return JSONResponse({
        "success": True,
        "message": message,
        "filepath": filepath
    })

@app.post("/verify_face")
async def verify_face(request: Request):
    data = await request.json()
    image_data = data['image']
    step = data['step']
    
    # Remove data URL prefix
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    # Decode base64
    image_bytes = base64.b64decode(image_data)
    
    # Save verification image
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"face_verify_{step}_{timestamp}.jpg"
    filepath = os.path.join("verification_data/face_verification", filename)
    
    with open(filepath, 'wb') as f:
        f.write(image_bytes)
    
    # Convert to numpy array for face recognition
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Find face encodings
    face_encodings = face_recognition.face_encodings(rgb_image)
    
    if not face_encodings:
        return JSONResponse({
            "success": False,
            "message": "কোন মুখ পাওয়া যায়নি / No face detected"
        })
    
    # Compare with training data
    if not TRAINING_ENCODINGS:
        return JSONResponse({
            "success": False,
            "message": "প্রশিক্ষণ ডেটা পাওয়া যায়নি / No training data found"
        })
    
    # Check if face matches training data
    face_encoding = face_encodings[0]
    matches = face_recognition.compare_faces(TRAINING_ENCODINGS, face_encoding, tolerance=0.6)
    
    if any(matches):
        if step == 'down':  # Last step
            verification_status['face_verified'] = True
            verification_status['vote_enabled'] = (
                verification_status['nid_front'] and 
                verification_status['nid_back'] and 
                verification_status['face_verified']
            )
        
        return JSONResponse({
            "success": True,
            "message": f"মুখ যাচাই সফল / Face verified for {step}"
        })
    else:
        return JSONResponse({
            "success": False,
            "message": "মুখ মিলেনি / Face does not match training data"
        })

@app.get("/status")
async def get_status():
    return JSONResponse(verification_status)

@app.get("/vote", response_class=HTMLResponse)
async def vote_page():
    if not verification_status['vote_enabled']:
        return """
        <html><body>
        <h1>Access Denied</h1>
        <p>Please complete all verification steps first.</p>
        <a href="/">Go back to verification</a>
        </body></html>
        """
    
    return """
    <html><body style="font-family: Arial; text-align: center; padding: 50px;">
    <h1 style="color: #006747;">🎉 ভোট দেওয়ার জন্য প্রস্তুত!</h1>
    <h2>Ready to Vote!</h2>
    <p>সব যাচাইকরণ সম্পন্ন হয়েছে। আপনি এখন ভোট দিতে পারেন।</p>
    <p>All verification completed. You can now cast your vote.</p>
    <button onclick="window.open('http://localhost:5173', '_blank')" 
            style="background: #28a745; color: white; padding: 20px 40px; 
                   font-size: 18px; border: none; border-radius: 10px; cursor: pointer;">
        🗳️ ভোটিং পেজে যান / Go to Voting Page
    </button>
    </body></html>
    """

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)