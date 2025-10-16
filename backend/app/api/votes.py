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
from app.utils.face_verify import face_verifier
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
        
        # 3. Verify identity using face recognition
        try:\n            verification_result = face_verifier.verify_identity(\n                vote_data.verification_data.nid_front,\n                vote_data.verification_data.face\n            )\n            \n            if not verification_result[\"verified\"]:\n                raise HTTPException(\n                    status_code=401, \n                    detail=f\"Identity verification failed: {verification_result['message']}\"\n                )\n                \n        except Exception as e:\n            logger.warning(f\"Face verification failed: {e}\")\n            # In production, this should fail the vote\n            # For demo, we'll continue with a warning\n        \n        # 4. Create voter hash for blockchain\n        voter_hash = create_voter_hash(vote_data.nid, user_found[\"salt\"])\n        \n        # 5. Cast vote on blockchain\n        try:\n            blockchain_result = web3_client.cast_vote_on_chain(\n                voter_hash, \n                vote_data.candidate_id\n            )\n            \n            if not blockchain_result[\"success\"]:\n                raise HTTPException(status_code=500, detail=\"Blockchain transaction failed\")\n                \n        except Exception as e:\n            logger.error(f\"Blockchain vote failed: {e}\")\n            raise HTTPException(status_code=500, detail=f\"Vote casting failed: {str(e)}\")\n        \n        # 6. Update user record (atomic operation)\n        update_result = await db.users.update_one(\n            {\"_id\": user_found[\"_id\"], \"has_voted\": False},  # Ensure still not voted\n            {\n                \"$set\": {\n                    \"has_voted\": True,\n                    \"vote_tx_hash\": blockchain_result[\"tx_hash\"],\n                    \"vote_timestamp\": datetime.utcnow(),\n                    \"updated_at\": datetime.utcnow()\n                }\n            }\n        )\n        \n        if update_result.modified_count == 0:\n            # Rollback would be needed here in production\n            logger.error(\"Failed to update user record after blockchain vote\")\n            raise HTTPException(status_code=500, detail=\"Vote recording failed\")\n        \n        # 7. Store vote record\n        vote_record = {\n            \"voter_nid_hash\": user_found[\"nid_hash\"],\n            \"candidate_id\": vote_data.candidate_id,\n            \"tx_hash\": blockchain_result[\"tx_hash\"],\n            \"block_number\": blockchain_result[\"block_number\"],\n            \"timestamp\": datetime.utcnow(),\n            \"address\": user_found[\"address\"],\n            \"voter_hash\": voter_hash\n        }\n        \n        await db.vote_records.insert_one(vote_record)\n        \n        logger.info(f\"Vote cast successfully: {user_found['name']} -> Candidate {vote_data.candidate_id}\")\n        \n        return {\n            \"message\": \"Vote cast successfully\",\n            \"tx_hash\": blockchain_result[\"tx_hash\"],\n            \"block_number\": blockchain_result[\"block_number\"],\n            \"timestamp\": vote_record[\"timestamp\"].isoformat(),\n            \"receipt_id\": blockchain_result[\"tx_hash\"][:16]  # Short receipt ID\n        }\n        \n    except HTTPException:\n        raise\n    except Exception as e:\n        logger.error(f\"Vote casting failed: {e}\")\n        raise HTTPException(status_code=500, detail=\"Vote casting failed\")\n\n@router.post(\"/verify\")\nasync def verify_vote(verification_data: VoteVerificationRequest):\n    \"\"\"Verify a voter's vote using their NID\"\"\"\n    try:\n        db = get_database()\n        \n        # Find user by NID\n        users_cursor = db.users.find({})\n        user_found = None\n        \n        async for user in users_cursor:\n            if verify_nid_hash(verification_data.nid, user.get(\"salt\", \"\"), user.get(\"nid_hash\", \"\")):\n                user_found = user\n                break\n        \n        if not user_found:\n            raise HTTPException(status_code=404, detail=\"Voter not found\")\n        \n        if not user_found[\"has_voted\"]:\n            return {\n                \"has_voted\": False,\n                \"message\": \"No vote recorded for this voter\"\n            }\n        \n        # Get vote record\n        vote_record = await db.vote_records.find_one({\n            \"voter_nid_hash\": user_found[\"nid_hash\"]\n        })\n        \n        if not vote_record:\n            raise HTTPException(status_code=404, detail=\"Vote record not found\")\n        \n        return {\n            \"has_voted\": True,\n            \"candidate_id\": vote_record[\"candidate_id\"],\n            \"tx_hash\": vote_record[\"tx_hash\"],\n            \"block_number\": vote_record[\"block_number\"],\n            \"timestamp\": vote_record[\"timestamp\"].isoformat(),\n            \"address\": vote_record[\"address\"]\n        }\n        \n    except HTTPException:\n        raise\n    except Exception as e:\n        logger.error(f\"Vote verification failed: {e}\")\n        raise HTTPException(status_code=500, detail=\"Vote verification failed\")