"""
User Data Models
Defines user, voter, and candidate data structures
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    VOTER = "voter"
    ADMIN = "admin"
    OBSERVER = "observer"

class Address(BaseModel):
    division: str
    district: str
    upazila: str
    ward: str

class UserRegistration(BaseModel):
    nid: str = Field(..., min_length=10, max_length=17, description="National ID")
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., pattern=r'^01[3-9]\d{8}$', description="Bangladesh mobile number")
    address: Address
    password: Optional[str] = None  # For admin users

class UserLogin(BaseModel):
    nid: str
    password: Optional[str] = None  # Optional for voters

class UserInDB(BaseModel):
    id: str
    nid_hash: str  # Hashed NID for privacy
    name: str
    phone_hash: str  # Hashed phone for privacy
    address: Address
    role: UserRole = UserRole.VOTER
    has_voted: bool = False
    vote_tx_hash: Optional[str] = None
    vote_timestamp: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Candidate(BaseModel):
    id: int
    name: str
    name_en: str
    party: str
    party_color: str
    candidate_number: int
    hash_id: str
    address: Address
    photo_url: Optional[str] = None
    manifesto: Optional[str] = None
    is_active: bool = True

class VoteRecord(BaseModel):
    id: str
    voter_nid_hash: str
    candidate_id: int
    tx_hash: str
    block_number: int
    timestamp: datetime
    address: Address
    verification_data: Optional[Dict[str, Any]] = None

class VotingStats(BaseModel):
    total_votes: int
    candidate_votes: Dict[int, int]
    turnout_percentage: float
    last_updated: datetime