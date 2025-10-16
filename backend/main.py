from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import verify

app = FastAPI(
    title="Bangladesh Voting System API",
    description="Blockchain-based National Voting System Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(verify.router, prefix="/api/verify", tags=["Verification"])

@app.get("/")
async def root():
    return {
        "message": "Bangladesh Voting System API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
