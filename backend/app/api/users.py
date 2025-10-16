"""
User Management API Routes
Handles user registration, login, and profile management
"""

from fastapi import APIRouter, HTTPException, Depends
from app.models.user_model import UserRegistration, UserLogin, UserInDB
from app.core.db import get_database
from app.utils.crypto_utils import hash_nid, hash_phone, hash_password, verify_password
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/register")
async def register_user(user_data: UserRegistration):
    """Register a new voter"""
    try:
        db = get_database()
        
        # Hash sensitive data
        nid_hash, salt = hash_nid(user_data.nid)
        phone_hash = hash_phone(user_data.phone)
        
        # Check if user already exists
        existing_user = await db.users.find_one({"nid_hash": nid_hash})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already registered")
        
        # Create user document
        user_doc = {
            "nid_hash": nid_hash,
            "salt": salt,
            "name": user_data.name,
            "phone_hash": phone_hash,
            "address": user_data.address.dict(),
            "role": "voter",
            "has_voted": False,
            "vote_tx_hash": None,
            "vote_timestamp": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        
        logger.info(f"User registered: {user_data.name} from {user_data.address.district}")
        
        return {
            "message": "User registered successfully",
            "user_id": str(result.inserted_id),
            "nid_hash": nid_hash[:8] + "..."  # Partial hash for confirmation
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login")
async def login_user(login_data: UserLogin):
    """Login user and return session info"""
    try:
        db = get_database()
        
        # Hash NID to find user
        # We need to find user by trying different salts (in production, use proper auth)
        users_cursor = db.users.find({"name": {"$exists": True}})
        user_found = None
        
        async for user in users_cursor:
            if verify_nid_hash(login_data.nid, user.get("salt", ""), user.get("nid_hash", "")):
                user_found = user
                break
        
        if not user_found:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # For admin users, verify password
        if user_found.get("role") == "admin" and login_data.password:
            if not verify_password(login_data.password, user_found.get("password_hash", "")):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "message": "Login successful",
            "user": {
                "id": str(user_found["_id"]),
                "name": user_found["name"],
                "role": user_found["role"],
                "has_voted": user_found["has_voted"],
                "address": user_found["address"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.get("/{nid}/status")
async def get_user_status(nid: str):
    """Get user voting status (without revealing vote choice)"""
    try:
        db = get_database()
        
        # Find user by NID (simplified for demo)
        users_cursor = db.users.find({})
        user_found = None
        
        async for user in users_cursor:
            if verify_nid_hash(nid, user.get("salt", ""), user.get("nid_hash", "")):
                user_found = user
                break
        
        if not user_found:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "has_voted": user_found["has_voted"],
            "vote_timestamp": user_found.get("vote_timestamp"),
            "tx_hash": user_found.get("vote_tx_hash"),
            "address": user_found["address"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail="Status check failed")