#!/usr/bin/env python3
"""
Simple training script - automatically trains with all your photos
"""

import os
import glob
from app.utils.face_verify import face_verifier

def train():
    print("\n" + "="*60)
    print("🎓 Training Face Recognition System")
    print("="*60)
    
    # Find NID photo
    nid_photos = glob.glob("training_data/nid/*.jpg")
    if not nid_photos:
        print("\n❌ Error: No NID photo found!")
        print("   Please capture your NID first using web_capture.py")
        return False
    
    nid_path = nid_photos[0]
    print(f"\n📇 NID Photo: {nid_path}")
    
    # Find face photos
    face_photos = sorted(glob.glob("training_data/faces/*.jpg"))
    if len(face_photos) < 5:
        print(f"\n❌ Error: Only {len(face_photos)} face photos found!")
        print("   Please capture at least 5 face photos")
        return False
    
    print(f"👤 Face Photos: {len(face_photos)} found")
    
    # Train the system
    print("\n⏳ Training... This may take a minute...")
    
    try:
        success = face_verifier.train_with_your_data(nid_path, face_photos)
        
        if success:
            print("\n" + "="*60)
            print("✅ Training Complete!")
            print("="*60)
            print(f"\n📊 Training Summary:")
            print(f"   - NID: 1 photo")
            print(f"   - Face: {len(face_verifier.reference_face_encodings)} photos")
            print(f"\n🎯 System Status: READY")
            print("\n📝 Next Steps:")
            print("   1. Start backend: python main.py")
            print("   2. Start frontend: npm run frontend:dev")
            print("   3. Test verification by voting")
            print("\n✅ Only YOUR NID and face will be accepted!")
            print("="*60)
            return True
        else:
            print("\n❌ Training failed!")
            print("   Check if photos contain clear faces")
            return False
            
    except Exception as e:
        print(f"\n❌ Error during training: {e}")
        return False

if __name__ == "__main__":
    train()
