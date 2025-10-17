from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import core modules
from app.core.db import connect_to_mongo, close_mongo_connection
from app.blockchain.web3_client import web3_client

# Import API routers
from app.api import users, votes, stats, admin, verify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Bangladesh Voting System API...")
    
    try:
        # Try to connect to MongoDB
        try:
            await connect_to_mongo()
            logger.info("✅ Database connected")
        except Exception as e:
            logger.warning(f"⚠️ Database connection failed: {e}")
        
        # Initialize blockchain client
        if web3_client.w3 and web3_client.w3.is_connected():
            logger.info("✅ Blockchain client initialized")
        else:
            logger.warning("⚠️ Blockchain client not connected")
            
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    try:
        await close_mongo_connection()
    except:
        pass
    logger.info("✅ Cleanup completed")

# Create FastAPI app
app = FastAPI(
    title="Bangladesh Voting System API",
    description="Blockchain-based National Voting System Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(votes.router, prefix="/api", tags=["Voting"])
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(verify.router, prefix="/api/verify", tags=["Verification"])

@app.get("/")
async def root():
    return {
        "message": "Bangladesh Voting System API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database
        from app.core.db import get_database
        db = get_database()
        if db:
            await db.command('ping')
            db_status = "connected"
        else:
            db_status = "disconnected"
    except Exception:
        db_status = "disconnected"
    
    # Check blockchain
    blockchain_status = "connected" if (web3_client.w3 and web3_client.w3.is_connected()) else "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "blockchain": blockchain_status,
        "contract_loaded": web3_client.contract is not None
    }

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
