"""
Statistics API Routes
Provides voting statistics and analytics
"""

from fastapi import APIRouter, HTTPException
from app.core.db import get_database
from app.blockchain.web3_client import web3_client
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{region}")
async def get_regional_stats(region: str):
    """Get voting statistics for a specific region"""
    try:
        db = get_database()
        
        # Define region hierarchy
        region_levels = ["ward", "upazila", "district", "division", "national"]
        
        if region not in region_levels:
            raise HTTPException(status_code=400, detail="Invalid region type")
        
        # Get vote records from database
        pipeline = []
        
        if region != "national":
            # Add region-specific filtering
            pipeline.append({
                "$match": {
                    f"address.{region}": {"$exists": True}
                }
            })
        
        # Group by candidate and count votes
        pipeline.extend([
            {
                "$group": {
                    "_id": "$candidate_id",
                    "vote_count": {"$sum": 1},
                    "regions": {"$addToSet": f"$address.{region}" if region != "national" else "$address.division"}
                }
            },
            {
                "$sort": {"vote_count": -1}
            }
        ])
        
        vote_results = await db.vote_records.aggregate(pipeline).to_list(None)
        
        # Get total votes from blockchain for verification
        try:
            blockchain_total = web3_client.get_total_votes()
        except Exception as e:
            logger.warning(f"Could not get blockchain stats: {e}")
            blockchain_total = 0
        
        # Calculate statistics
        total_votes = sum(result["vote_count"] for result in vote_results)
        
        # Get registered voters count
        total_registered = await db.users.count_documents({"role": "voter"})
        
        turnout_percentage = (total_votes / total_registered * 100) if total_registered > 0 else 0
        
        # Format candidate results
        candidate_stats = {}
        for result in vote_results:
            candidate_id = result["_id"]
            vote_count = result["vote_count"]
            percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0
            
            candidate_stats[candidate_id] = {
                "votes": vote_count,
                "percentage": round(percentage, 2),
                "regions": result.get("regions", [])
            }
        
        return {
            "region": region,
            "total_votes": total_votes,
            "total_registered": total_registered,
            "turnout_percentage": round(turnout_percentage, 2),
            "blockchain_total": blockchain_total,
            "candidate_stats": candidate_stats,
            "data_integrity": total_votes == blockchain_total
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stats retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Statistics unavailable")

@router.get("/live/summary")
async def get_live_summary():
    """Get live voting summary"""
    try:
        db = get_database()
        
        # Get current vote counts
        pipeline = [
            {
                "$group": {
                    "_id": "$candidate_id",
                    "votes": {"$sum": 1}
                }
            },
            {"$sort": {"votes": -1}}
        ]
        
        results = await db.vote_records.aggregate(pipeline).to_list(None)
        
        # Get blockchain verification
        try:
            blockchain_total = web3_client.get_total_votes()
            blockchain_active = web3_client.is_voting_active()
        except Exception:
            blockchain_total = 0
            blockchain_active = False
        
        # Get registered voters
        total_registered = await db.users.count_documents({"role": "voter"})
        total_voted = await db.users.count_documents({"has_voted": True})
        
        return {
            "voting_active": blockchain_active,
            "total_votes": sum(r["votes"] for r in results),
            "total_registered": total_registered,
            "total_voted": total_voted,
            "blockchain_total": blockchain_total,
            "candidate_votes": {r["_id"]: r["votes"] for r in results},
            "turnout_rate": round((total_voted / total_registered * 100), 2) if total_registered > 0 else 0
        }
        
    except Exception as e:
        logger.error(f"Live summary failed: {e}")
        raise HTTPException(status_code=500, detail="Live summary unavailable")