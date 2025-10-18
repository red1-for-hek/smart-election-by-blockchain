import numpy as np
from PIL import Image
import io
import base64
import cv2

class FaceVerifier:
    def __init__(self):
        # Simple verification without face recognition
        self.trained = True  # Always ready for simple verification
    
    def train_with_your_data(self, nid_image_path: str, face_images_paths: list):
        """Simple training - just mark as trained"""
        self.trained = True
        return True
    
    def decode_base64_image(self, base64_string: str):
        """Convert base64 string to numpy array"""
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    
    def verify_nid(self, nid_image_base64: str) -> dict:
        """Simple NID verification - always passes for demo"""
        try:
            # Just check if image exists
            nid_image = self.decode_base64_image(nid_image_base64)
            if nid_image is not None:
                return {
                    "verified": True,
                    "confidence": 0.95,
                    "message": "NID যাচাই সফল"
                }
        except Exception as e:
            pass
        
        return {
            "verified": False,
            "confidence": 0.0,
            "message": "NID যাচাই করা যায়নি"
        }
    
    def verify_face(self, face_image_base64: str) -> dict:
        """Simple face verification - always passes for demo"""
        try:
            # Just check if image exists
            face_image = self.decode_base64_image(face_image_base64)
            if face_image is not None:
                return {
                    "verified": True,
                    "confidence": 0.92,
                    "message": "মুখ যাচাই সফল"
                }
        except Exception as e:
            pass
        
        return {
            "verified": False,
            "confidence": 0.0,
            "message": "মুখ যাচাই করা যায়নি"
        }

# Global instance
face_verifier = FaceVerifier()
