"""
Cryptographic Utilities
Handles hashing, salting, and privacy protection
"""

import hashlib
import secrets
from typing import Tuple
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_salt() -> str:
    """Generate a random salt"""
    return secrets.token_hex(32)

def hash_nid(nid: str, salt: str = None) -> Tuple[str, str]:
    """
    Hash NID with salt for privacy protection
    
    Args:
        nid: National ID number
        salt: Optional salt (generates new if not provided)
    
    Returns:
        Tuple of (hashed_nid, salt)
    """
    if salt is None:
        salt = generate_salt()
    
    # Combine NID with salt
    salted_nid = f"{nid}:{salt}"
    
    # Create SHA3-256 hash
    hash_obj = hashlib.sha3_256(salted_nid.encode('utf-8'))
    hashed_nid = hash_obj.hexdigest()
    
    return hashed_nid, salt

def hash_phone(phone: str) -> str:
    """Hash phone number for privacy"""
    return hashlib.sha256(phone.encode('utf-8')).hexdigest()

def create_voter_hash(nid: str, salt: str) -> str:
    """
    Create voter hash for blockchain storage
    This is what gets stored on-chain to maintain privacy
    """
    salted_data = f"{nid}:{salt}"
    return hashlib.sha3_256(salted_data.encode('utf-8')).hexdigest()

def verify_nid_hash(nid: str, salt: str, stored_hash: str) -> bool:
    """Verify NID against stored hash"""
    computed_hash, _ = hash_nid(nid, salt)
    return computed_hash == stored_hash

def hash_password(password: str) -> str:
    """Hash password for admin users"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def generate_session_token() -> str:
    """Generate secure session token"""
    return secrets.token_urlsafe(32)

def create_vote_receipt_id(voter_hash: str, tx_hash: str) -> str:
    """Create unique receipt ID for vote verification"""
    combined = f"{voter_hash}:{tx_hash}"
    return hashlib.sha256(combined.encode('utf-8')).hexdigest()[:16]