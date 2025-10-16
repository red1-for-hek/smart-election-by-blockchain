from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    mongo_uri: str
    
    # Blockchain
    rpc_url: str
    contract_address: Optional[str] = None
    admin_private_key: str
    admin_address: str
    
    # Authentication
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    
    # Face Verification
    face_verification_enabled: bool = True
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()