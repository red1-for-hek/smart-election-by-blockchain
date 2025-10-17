"""
Voting API Routes
Handles vote casting and verification
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.core.db import get_database
from app.blockchain.web3_client import web3_client
from app.utils.crypto_utils import create_voter_hash, verify_nid_hash
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class VerificationData(BaseModel):
    nid_front: str  # base64 image
    nid_back: str   # base64 image
    face: str       # base64 image

class VoteRequest(BaseModel):
    nid: str
    candidate_id: int
    verification_data: VerificationData

class VoteVerificationRequest(BaseModel):
    nid: str
    secret_key: Optional[str] = None

@router.post("/vote")
async def cast_vote(vote_data: VoteRequest):
    """Cast a vote with identity verification"""
    try:
        db = get_database()
        
        # 1. Find user by NID
        users_cursor = db.users.find({})
        user_found = None
        
        async for user in users_cursor:
            if verify_nid_hash(vote_data.nid, user.get("salt", ""), user.get("nid_hash", "")):
                user_found = user
                break
        
        if not user_found:
            raise HTTPException(status_code=404, detail="Voter not found")
        
        # 2. Check if already voted
        if user_found["has_voted"]:
            raise HTTPException(status_code=400, detail="Voter has already voted")
        
        # 3. Verify identity using face recognition (simplified for demo)
        try:
            # Face verification would go here
            logger.info("Face verification skipped for demo")
        except Exception as e:
            logger.warning(f"Face verification failed: {e}")
        
        # 4. Create voter hash for blockchain
        voter_hash = create_voter_hash(vote_data.nid, user_found["salt"])
        
        # 5. Cast vote on blockchain
        try:
            blockchain_result = web3_client.cast_vote_on_chain(
                voter_hash, 
                vote_data.candidate_id
            )
            
            if not blockchain_result["success"]:
                raise HTTPException(status_code=500, detail="Blockchain transaction failed")
                
        except Exception as e:
            logger.error(f"Blockchain vote failed: {e}")
            raise HTTPException(status_code=500, detail=f"Vote casting failed: {str(e)}")
        
        # 6. Update user record (atomic operation)
        update_result = await db.users.update_one(
            {"_id": user_found["_id"], "has_voted": False},  # Ensure still not voted
            {
                "$set": {
                    "has_voted": True,
                    "vote_tx_hash": blockchain_result["tx_hash"],
                    "vote_timestamp": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if update_result.modified_count == 0:
            # Rollback would be needed here in production
            logger.error("Failed to update user record after blockchain vote")
            raise HTTPException(status_code=500, detail="Vote recording failed")
        
        # 7. Store vote record
        vote_record = {
            "voter_nid_hash": user_found["nid_hash"],
            "candidate_id": vote_data.candidate_id,
            "tx_hash": blockchain_result["tx_hash"],
            "block_number": blockchain_result["block_number"],
            "timestamp": datetime.utcnow(),
            "address": user_found["address"],
            "voter_hash": voter_hash
        }
        
        await db.vote_records.insert_one(vote_record)
        
        logger.info(f"Vote cast successfully: {user_found['name']} -> Candidate {vote_data.candidate_id}")
        
        return {
            "message": "Vote cast successfully",
            "tx_hash": blockchain_result["tx_hash"],
            "block_number": blockchain_result["block_number"],
            "timestamp": vote_record["timestamp"].isoformat(),
            "receipt_id": blockchain_result["tx_hash"][:16]  # Short receipt ID
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vote casting failed: {e}")
        raise HTTPException(status_code=500, detail="Vote casting failed")

@router.post("/verify")
async def verify_vote(verification_data: VoteVerificationRequest):
    """Verify a voter's vote using their NID"""
    try:
        db = get_database()
        
        # Find user by NID
        users_cursor = db.users.find({})
        user_found = None
        
        async for user in users_cursor:
            if verify_nid_hash(verification_data.nid, user.get("salt", ""), user.get("nid_hash", "")):
                user_found = user
                break
        
        if not user_found:
            raise HTTPException(status_code=404, detail="Voter not found")
        
        if not user_found["has_voted"]:
            return {
                "has_voted": False,
                "message": "No vote recorded for this voter"
            }
        
        # Get vote record
        vote_record = await db.vote_records.find_one({
            "voter_nid_hash": user_found["nid_hash"]
        })
        
        if not vote_record:
            raise HTTPException(status_code=404, detail="Vote record not found")
        
        return {
            "has_voted": True,
            "candidate_id": vote_record["candidate_id"],
            "tx_hash": vote_record["tx_hash"],
            "block_number": vote_record["block_number"],
            "timestamp": vote_record["timestamp"].isoformat(),
            "address": vote_record["address"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vote verification failed: {e}")
        raise HTTPException(status_code=500, detail="Vote verification failed")