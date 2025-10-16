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
        pipeline.extend([\n            {\n                \"$group\": {\n                    \"_id\": \"$candidate_id\",\n                    \"vote_count\": {\"$sum\": 1},\n                    \"regions\": {\"$addToSet\": f\"$address.{region}\" if region != \"national\" else \"$address.division\"}\n                }\n            },\n            {\n                \"$sort\": {\"vote_count\": -1}\n            }\n        ])\n        \n        vote_results = await db.vote_records.aggregate(pipeline).to_list(None)\n        \n        # Get total votes from blockchain for verification\n        try:\n            blockchain_total = web3_client.get_total_votes()\n        except Exception as e:\n            logger.warning(f\"Could not get blockchain stats: {e}\")\n            blockchain_total = 0\n        \n        # Calculate statistics\n        total_votes = sum(result[\"vote_count\"] for result in vote_results)\n        \n        # Get registered voters count\n        total_registered = await db.users.count_documents({\"role\": \"voter\"})\n        \n        turnout_percentage = (total_votes / total_registered * 100) if total_registered > 0 else 0\n        \n        # Format candidate results\n        candidate_stats = {}\n        for result in vote_results:\n            candidate_id = result[\"_id\"]\n            vote_count = result[\"vote_count\"]\n            percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0\n            \n            candidate_stats[candidate_id] = {\n                \"votes\": vote_count,\n                \"percentage\": round(percentage, 2),\n                \"regions\": result.get(\"regions\", [])\n            }\n        \n        return {\n            \"region\": region,\n            \"total_votes\": total_votes,\n            \"total_registered\": total_registered,\n            \"turnout_percentage\": round(turnout_percentage, 2),\n            \"blockchain_total\": blockchain_total,\n            \"candidate_stats\": candidate_stats,\n            \"data_integrity\": total_votes == blockchain_total\n        }\n        \n    except HTTPException:\n        raise\n    except Exception as e:\n        logger.error(f\"Stats retrieval failed: {e}\")\n        raise HTTPException(status_code=500, detail=\"Statistics unavailable\")\n\n@router.get(\"/live/summary\")\nasync def get_live_summary():\n    \"\"\"Get live voting summary\"\"\"\n    try:\n        db = get_database()\n        \n        # Get current vote counts\n        pipeline = [\n            {\n                \"$group\": {\n                    \"_id\": \"$candidate_id\",\n                    \"votes\": {\"$sum\": 1}\n                }\n            },\n            {\"$sort\": {\"votes\": -1}}\n        ]\n        \n        results = await db.vote_records.aggregate(pipeline).to_list(None)\n        \n        # Get blockchain verification\n        try:\n            blockchain_total = web3_client.get_total_votes()\n            blockchain_active = web3_client.is_voting_active()\n        except Exception:\n            blockchain_total = 0\n            blockchain_active = False\n        \n        # Get registered voters\n        total_registered = await db.users.count_documents({\"role\": \"voter\"})\n        total_voted = await db.users.count_documents({\"has_voted\": True})\n        \n        return {\n            \"voting_active\": blockchain_active,\n            \"total_votes\": sum(r[\"votes\"] for r in results),\n            \"total_registered\": total_registered,\n            \"total_voted\": total_voted,\n            \"blockchain_total\": blockchain_total,\n            \"candidate_votes\": {r[\"_id\"]: r[\"votes\"] for r in results},\n            \"turnout_rate\": round((total_voted / total_registered * 100), 2) if total_registered > 0 else 0\n        }\n        \n    except Exception as e:\n        logger.error(f\"Live summary failed: {e}\")\n        raise HTTPException(status_code=500, detail=\"Live summary unavailable\")