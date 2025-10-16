# Quick Start Guide - Verification System

## ✅ What's Been Completed

### Frontend Updates:
1. ✅ Camera integration with real device camera
2. ✅ NID card scanning with correct BD NID ratio (1.586:1)
3. ✅ Face verification with movement detection (left, right, straight)
4. ✅ Circular camera view for face capture
5. ✅ Passport scanning for postal voting
6. ✅ Removed countdown, added verification status alerts
7. ✅ "আপনার পরিচয় যাচাই হচ্ছে..." status during verification
8. ✅ Success/failure messages in Bengali

### Backend (Verification Only):
1. ✅ FastAPI backend structure
2. ✅ Face recognition system (only accepts YOUR NID and face)
3. ✅ Verification API endpoint
4. ✅ Training system for your specific NID/face

## 🚀 How to Run

### Terminal 1: Frontend
```bash
npm run frontend:dev
```
Access at: http://localhost:5173 (or the port shown)

### Terminal 2: Backend (Verification)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
Backend runs at: http://localhost:8000

## 📸 Setup Your NID & Face Recognition

### Step 1: Capture Training Photos

**For GitHub Codespaces (Web-based):**
```bash
cd backend
source venv/bin/activate
python3 web_capture.py
```
Then open the URL in your browser (port 8001 will be forwarded).

**For Local Machine (Desktop app):**
```bash
cd backend
./setup_training.sh
```

This will:
- Capture your NID card photo
- Automatically capture 30 photos of your face
- Save everything to `training_data/`

### Step 3: Train the System
```bash
curl -X POST "http://localhost:8000/api/verify/train-system" \
  -H "Content-Type: application/json" \
  -d '{
    "nid_image_path": "backend/training_data/nid/my_nid.jpg",
    "face_images_paths": [
      "backend/training_data/faces/face1.jpg",
      "backend/training_data/faces/face2.jpg",
      "backend/training_data/faces/face3.jpg"
    ]
  }'
```

## 🧪 Test the Verification

1. Open frontend: http://localhost:5173
2. Login with demo credentials:
   - NID: 1234567890
   - Password: NoPassword
3. Go to "ভোট দিন" (Vote)
4. Select a candidate
5. Camera will open for:
   - NID front scan
   - NID back scan
   - Face verification (follow movement instructions)
6. System will verify:
   - ✅ If it's YOUR NID and face → "পরিচয় সফলভাবে যাচাই করা হয়েছে"
   - ❌ If it's someone else → "আপনার পরিচয় যাচাই করা যায়নি, আবার চেষ্টা করুন"

## 📁 Current Structure

```
bangladesh-voting-system/
├── frontend/                    # React app (WORKING)
│   ├── src/
│   │   ├── components/
│   │   │   └── NIDVerificationDialog.tsx  # ✅ Camera + verification
│   │   ├── lib/
│   │   │   └── api.ts          # ✅ API client
│   │   └── ...
│   └── .env                     # API URL config
├── backend/                     # FastAPI (VERIFICATION ONLY)
│   ├── app/
│   │   ├── api/
│   │   │   └── verify.py       # ✅ Verification endpoint
│   │   └── utils/
│   │       └── face_verify.py  # ✅ Face recognition
│   ├── training_data/           # Your NID & face photos
│   ├── main.py                  # ✅ FastAPI app
│   └── requirements.txt         # ✅ Dependencies
└── QUICKSTART.md               # This file
```

## 🎯 What Works Now

1. **Camera Access**: Real device camera opens
2. **NID Scanning**: Correct ratio, captures front & back
3. **Face Verification**: Movement detection, circular view
4. **API Integration**: Frontend → Backend verification
5. **Custom Recognition**: Only YOUR NID/face accepted
6. **Bengali Messages**: All status messages in Bengali
7. **Postal Voting**: Includes passport scanning

## 🔜 Next Steps (Not Yet Implemented)

- Full blockchain integration
- MongoDB database
- User authentication
- Vote recording on blockchain
- Statistics dashboard
- Admin panel
- Real-time updates via WebSocket

## 💡 Tips

- Use good lighting for training photos
- Take 5-10 face photos from different angles
- NID photo should be clear and flat
- Adjust tolerance in `face_verify.py` if needed (line 67, 145)

## 🐛 Troubleshooting

**Camera not working?**
- Allow camera permissions in browser
- Use HTTPS or localhost only

**face_recognition install fails?**
```bash
sudo apt-get install cmake build-essential
pip install dlib
pip install face-recognition
```

**Low verification confidence?**
- Add more training photos
- Ensure good lighting
- Use higher resolution images
