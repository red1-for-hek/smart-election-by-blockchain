"""
Admin API Routes
Administrative functions and system management
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.db import get_database
from app.blockchain.web3_client import web3_client
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Simple admin authentication (in production, use proper JWT)
async def verify_admin_token(token: str = None):
    """Verify admin authentication"""
    if not token or token != "admin-demo-token":
        raise HTTPException(status_code=401, detail="Admin access required")
    return True

@router.get("/ledgers")
async def get_blockchain_ledgers(admin_auth: bool = Depends(verify_admin_token)):
    """Get blockchain transaction ledgers (admin only)"""
    try:
        db = get_database()
        
        # Get all vote records with blockchain data
        vote_records = await db.vote_records.find(
            {},
            {
                "voter_nid_hash": 0,  # Hide sensitive data
                "voter_hash": 1,
                "candidate_id": 1,
                "tx_hash": 1,
                "block_number": 1,
                "timestamp": 1,
                "address": 1
            }
        ).to_list(None)
        
        # Get blockchain verification data
        blockchain_stats = {}
        try:
            blockchain_stats = {
                "total_votes": web3_client.get_total_votes(),
                "voting_active": web3_client.is_voting_active(),
                "contract_address": web3_client.contract.address if web3_client.contract else None
            }
        except Exception as e:
            logger.warning(f"Could not get blockchain stats: {e}")
        
        # Calculate summary statistics
        candidate_counts = {}
        for record in vote_records:
            candidate_id = record["candidate_id"]
            candidate_counts[candidate_id] = candidate_counts.get(candidate_id, 0) + 1
        
        return {
            "total_transactions": len(vote_records),
            "blockchain_stats": blockchain_stats,
            "candidate_counts": candidate_counts,
            "transactions": [
                {
                    "tx_hash": record["tx_hash"],
                    "block_number": record["block_number"],
                    "candidate_id": record["candidate_id"],
                    "timestamp": record["timestamp"].isoformat(),
                    "region": f"{record['address']['division']} > {record['address']['district']}"
                }
                for record in vote_records[-50:]  # Last 50 transactions
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ledger retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Ledger data unavailable")

@router.get("/system-status")
async def get_system_status(admin_auth: bool = Depends(verify_admin_token)):
    """Get comprehensive system status"""
    try:
        db = get_database()
        
        # Database statistics
        db_stats = {
            "total_users": await db.users.count_documents({}),
            "voted_users": await db.users.count_documents({"has_voted": True}),
            "total_vote_records": await db.vote_records.count_documents({})
        }
        
        # Blockchain status
        blockchain_status = {
            "connected": False,
            "contract_loaded": False,
            "current_block": 0,
            "total_votes": 0
        }
        
        try:
            if web3_client.w3 and web3_client.w3.is_connected():
                blockchain_status["connected"] = True
                blockchain_status["current_block"] = web3_client.w3.eth.block_number
                
                if web3_client.contract:
                    blockchain_status["contract_loaded"] = True
                    blockchain_status["total_votes"] = web3_client.get_total_votes()
                    
        except Exception as e:
            logger.warning(f"Blockchain status check failed: {e}")
        
        # Data integrity check
        data_integrity = {
            "db_blockchain_match": db_stats["total_vote_records"] == blockchain_status["total_votes"],
            "user_vote_match": db_stats["voted_users"] == db_stats["total_vote_records"]
        }
        
        return {
            "database": db_stats,
            "blockchain": blockchain_status,
            "data_integrity": data_integrity,
            "system_health": all(data_integrity.values())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"System status check failed: {e}")
        raise HTTPException(status_code=500, detail="System status unavailable")