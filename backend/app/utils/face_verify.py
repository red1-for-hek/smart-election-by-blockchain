import face_recognition
import numpy as np
from PIL import Image
import io
import base64
import cv2

class FaceVerifier:
    def __init__(self):
        # Store your reference NID and face encodings
        # These will be loaded from training data
        self.reference_nid_encoding = None
        self.reference_face_encodings = []
        self.trained = False
    
    def train_with_your_data(self, nid_image_path: str, face_images_paths: list):
        """
        Train the system with YOUR specific NID and face images
        nid_image_path: Path to your NID card image
        face_images_paths: List of paths to multiple photos of your face
        """
        # Load and encode NID
        nid_image = face_recognition.load_image_file(nid_image_path)
        nid_face_locations = face_recognition.face_locations(nid_image)
        
        if len(nid_face_locations) > 0:
            nid_encodings = face_recognition.face_encodings(nid_image, nid_face_locations)
            if len(nid_encodings) > 0:
                self.reference_nid_encoding = nid_encodings[0]
        
        # Load and encode multiple face images
        for face_path in face_images_paths:
            face_image = face_recognition.load_image_file(face_path)
            face_locations = face_recognition.face_locations(face_image)
            
            if len(face_locations) > 0:
                face_encodings = face_recognition.face_encodings(face_image, face_locations)
                if len(face_encodings) > 0:
                    self.reference_face_encodings.append(face_encodings[0])
        
        self.trained = len(self.reference_face_encodings) > 0
        return self.trained
    
    def decode_base64_image(self, base64_string: str):
        """Convert base64 string to numpy array"""
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    
    def verify_nid(self, nid_image_base64: str) -> dict:
        """
        Verify if the provided NID matches YOUR reference NID
        Returns: {"verified": bool, "confidence": float, "message": str}
        """
        if not self.trained or self.reference_nid_encoding is None:
            return {
                "verified": False,
                "confidence": 0.0,
                "message": "সিস্টেম প্রশিক্ষিত নয়"
            }
        
        try:
            # Decode image
            nid_image = self.decode_base64_image(nid_image_base64)
            
            # Find faces in the NID
            face_locations = face_recognition.face_locations(nid_image)
            
            if len(face_locations) == 0:
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "NID তে কোন মুখ পাওয়া যায়নি"
                }
            
            # Get face encoding
            face_encodings = face_recognition.face_encodings(nid_image, face_locations)
            
            if len(face_encodings) == 0:
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "NID যাচাই করা যায়নি"
                }
            
            # Compare with reference
            matches = face_recognition.compare_faces(
                [self.reference_nid_encoding], 
                face_encodings[0],
                tolerance=0.6
            )
            
            face_distances = face_recognition.face_distance(
                [self.reference_nid_encoding], 
                face_encodings[0]
            )
            
            confidence = 1 - face_distances[0] if len(face_distances) > 0 else 0.0
            
            if matches[0] and confidence > 0.4:
                return {
                    "verified": True,
                    "confidence": float(confidence),
                    "message": "NID যাচাই সফল"
                }
            else:
                return {
                    "verified": False,
                    "confidence": float(confidence),
                    "message": "আপনার পরিচয় যাচাই করা যায়নি, আবার চেষ্টা করুন"
                }
        
        except Exception as e:
            return {
                "verified": False,
                "confidence": 0.0,
                "message": f"ত্রুটি: {str(e)}"
            }
    
    def verify_face(self, face_image_base64: str) -> dict:
        """
        Verify if the provided face matches YOUR reference faces
        Returns: {"verified": bool, "confidence": float, "message": str}
        """
        if not self.trained or len(self.reference_face_encodings) == 0:
            return {
                "verified": False,
                "confidence": 0.0,
                "message": "সিস্টেম প্রশিক্ষিত নয়"
            }
        
        try:
            # Decode image
            face_image = self.decode_base64_image(face_image_base64)
            
            # Find faces
            face_locations = face_recognition.face_locations(face_image)
            
            if len(face_locations) == 0:
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "কোন মুখ পাওয়া যায়নি"
                }
            
            # Get face encoding
            face_encodings = face_recognition.face_encodings(face_image, face_locations)
            
            if len(face_encodings) == 0:
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "মুখ যাচাই করা যায়নি"
                }
            
            # Compare with all reference faces
            matches = face_recognition.compare_faces(
                self.reference_face_encodings,
                face_encodings[0],
                tolerance=0.6
            )
            
            face_distances = face_recognition.face_distance(
                self.reference_face_encodings,
                face_encodings[0]
            )
            
            # Get best match
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                confidence = 1 - face_distances[best_match_index]
                
                if matches[best_match_index] and confidence > 0.4:
                    return {
                        "verified": True,
                        "confidence": float(confidence),
                        "message": "মুখ যাচাই সফল"
                    }
            
            return {
                "verified": False,
                "confidence": 0.0,
                "message": "আপনার পরিচয় যাচাই করা যায়নি, আবার চেষ্টা করুন"
            }
        
        except Exception as e:
            return {
                "verified": False,
                "confidence": 0.0,
                "message": f"ত্রুটি: {str(e)}"
            }

# Global instance
face_verifier = FaceVerifier()
