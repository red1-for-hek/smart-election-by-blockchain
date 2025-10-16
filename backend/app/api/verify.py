from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.face_verify import face_verifier

router = APIRouter()

class NIDVerificationRequest(BaseModel):
    nid_front: str  # base64 encoded image
    nid_back: str   # base64 encoded image
    face: str       # base64 encoded image

class VerificationResponse(BaseModel):
    nid_verified: bool
    face_verified: bool
    overall_verified: bool
    nid_confidence: float
    face_confidence: float
    message: str

@router.post("/verify-identity", response_model=VerificationResponse)
async def verify_identity(request: NIDVerificationRequest):
    """
    Verify NID and face against the trained reference data
    Only YOUR specific NID and face will be accepted
    """
    
    # Verify NID
    nid_result = face_verifier.verify_nid(request.nid_front)
    
    # Verify Face
    face_result = face_verifier.verify_face(request.face)
    
    # Both must pass for overall verification
    overall_verified = nid_result["verified"] and face_result["verified"]
    
    if overall_verified:
        message = "পরিচয় সফলভাবে যাচাই করা হয়েছে"
    elif not nid_result["verified"]:
        message = nid_result["message"]
    else:
        message = face_result["message"]
    
    return VerificationResponse(
        nid_verified=nid_result["verified"],
        face_verified=face_result["verified"],
        overall_verified=overall_verified,
        nid_confidence=nid_result["confidence"],
        face_confidence=face_result["confidence"],
        message=message
    )

@router.post("/train-system")
async def train_system(
    nid_image_path: str,
    face_images_paths: list[str]
):
    """
    Train the system with your NID and face images
    This should be called once during setup
    """
    success = face_verifier.train_with_your_data(nid_image_path, face_images_paths)
    
    if success:
        return {
            "success": True,
            "message": "সিস্টেম সফলভাবে প্রশিক্ষিত হয়েছে",
            "face_samples": len(face_verifier.reference_face_encodings)
        }
    else:
        raise HTTPException(
            status_code=400,
            detail="সিস্টেম প্রশিক্ষণ ব্যর্থ হয়েছে"
        )
