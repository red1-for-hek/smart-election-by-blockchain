# Bangladesh Voting System - Backend

A complete blockchain-based voting system backend built with FastAPI, MongoDB, and Ethereum smart contracts.

## 🎯 Architecture Overview

- **FastAPI**: Async Python web framework
- **MongoDB Atlas**: Cloud database (free tier)
- **Ethereum/Polygon**: Smart contract deployment
- **Web3.py**: Blockchain interaction
- **Face Recognition**: Identity verification
- **WebSocket**: Real-time updates

## 🚀 Quick Start Guide

### Prerequisites Setup

You need to create accounts and get API keys for:

1. **MongoDB Atlas** (Free)
2. **Infura/Alchemy** (Free tier)
3. **Ethereum Wallet** (MetaMask)

---

## Step-by-Step Setup Instructions

### Step 1: Environment Setup

```bash
# Navigate to backend directory
cd /workspaces/smart-election-by-blockchain/backend

# Run setup script
./setup.sh
```

**Expected Output:**
```
🚀 Setting up Bangladesh Voting System Backend...
📦 Creating Python virtual environment...
📥 Installing Python dependencies...
🔧 Installing Solidity compiler...
✅ Setup complete!
```

**Verification:**
```bash
# Activate virtual environment
source .venv/bin/activate

# Test imports
python -c "import fastapi, web3, motor, solcx; print('✅ All dependencies installed')"
```

### Step 2: Create MongoDB Atlas Database

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Sign up/Login** with your email
3. **Create New Project**: "VotingSystem"
4. **Build Database**: Choose "FREE" tier
5. **Cloud Provider**: AWS, Region: Any
6. **Cluster Name**: "voting-cluster"
7. **Create Database User**:
   - Username: `voting_admin`
   - Password: Generate secure password
8. **Network Access**: Add IP `0.0.0.0/0` (for development)
9. **Connect**: Choose "Connect your application"
10. **Copy Connection String**

**Expected Connection String Format:**
```
mongodb+srv://voting_admin:<password>@voting-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 3: Get Blockchain RPC URL

#### Option A: Infura (Recommended)
1. **Go to Infura**: https://infura.io/
2. **Sign up/Login**
3. **Create New Project**: "VotingSystem"
4. **Select Network**: Polygon Mumbai
5. **Copy Project ID**

**Your RPC URL:**
```
https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
```

#### Option B: Alchemy
1. **Go to Alchemy**: https://alchemy.com/
2. **Create App**: Polygon Mumbai testnet
3. **Copy HTTP URL**

### Step 4: Create Ethereum Wallet

1. **Install MetaMask**: https://metamask.io/
2. **Create New Wallet**
3. **Add Polygon Mumbai Network**:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com/`
   - Chain ID: `80001`
   - Currency: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com/`
4. **Get Test MATIC**: https://faucet.polygon.technology/
5. **Export Private Key**: MetaMask → Account → Export Private Key

### Step 5: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

**Fill in your .env file:**
```env
MONGO_URI=mongodb+srv://voting_admin:YOUR_PASSWORD@voting-cluster.xxxxx.mongodb.net/voting_system?retryWrites=true&w=majority
RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ADMIN_ADDRESS=0xYOUR_PUBLIC_ADDRESS_HERE
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Verification:**
```bash
# Test configuration
python -c "from app.core.config import settings; print('✅ Config loaded:', settings.mongo_uri[:20])"
```

### Step 6: Compile and Deploy Smart Contract

```bash
# Compile contract
python app/blockchain/compile_and_deploy.py
```

**Expected Output:**
```
🔧 Compiling VoteContract.sol...
✅ Contract compiled successfully
🚀 Deploying to Polygon Mumbai...
📝 Contract deployed at: 0x1234567890abcdef...
💾 Contract address saved to .env
```

**Update .env with contract address:**
```env
CONTRACT_ADDRESS=0x1234567890abcdef...
```

### Step 7: Start Backend Server

```bash
# Start server
python main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Connected to MongoDB
INFO:     Blockchain client initialized
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Verification:**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
{"status": "healthy", "database": "connected", "blockchain": "connected"}
```

### Step 8: Test API Endpoints

```bash
# Test user registration
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nid": "1234567890123",
    "name": "Test User",
    "phone": "01700000000",
    "address": {
      "division": "ঢাকা",
      "district": "ঢাকা",
      "upazila": "ধানমন্ডি",
      "ward": "১"
    }
  }'

# Expected response:
{"message": "User registered successfully", "user_id": "..."}
```

```bash
# Test vote casting
curl -X POST http://localhost:8000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "nid": "1234567890123",
    "candidate_id": 1,
    "verification_data": {
      "nid_front": "base64_image_data",
      "nid_back": "base64_image_data", 
      "face": "base64_image_data"
    }
  }'

# Expected response:
{"message": "Vote cast successfully", "tx_hash": "0x...", "block_number": 12345}
```

### Step 9: Connect Frontend

```bash
# Start frontend (in another terminal)
cd /workspaces/smart-election-by-blockchain
npm run frontend:dev
```

**Frontend should now connect to backend at:**
- Backend API: `http://localhost:8000`
- WebSocket: `ws://localhost:8000/ws`

---

## 🔧 Development Commands

```bash
# Run tests
pytest tests/

# Check code style
black app/
flake8 app/

# View logs
tail -f logs/app.log

# Reset database (development only)
python scripts/reset_db.py
```

## 🔒 Security Features

### Privacy Protection
- **On-chain**: Only hashed voter IDs and candidate IDs
- **Off-chain**: Encrypted voter identity mapping in MongoDB
- **Face Verification**: Local processing, no cloud storage

### Threat Mitigations
- **Double Voting**: Smart contract prevents duplicate votes
- **Identity Verification**: Face recognition + NID verification
- **Data Integrity**: Blockchain immutability
- **Access Control**: JWT authentication + admin roles

### Production Hardening
- Use HSM for private key storage
- Implement key rotation
- Add rate limiting
- Enable audit logging
- Use threshold decryption for tallies

## 📊 API Documentation

Once server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```bash
# Check connection string
python -c "from pymongo import MongoClient; MongoClient('YOUR_MONGO_URI').admin.command('ping'); print('✅ Connected')"
```

**Blockchain Connection Failed:**
```bash
# Check RPC URL
python -c "from web3 import Web3; w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL')); print('✅ Connected, Block:', w3.eth.block_number)"
```

**Contract Deployment Failed:**
```bash
# Check wallet balance
python -c "from web3 import Web3; w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL')); print('Balance:', w3.eth.get_balance('YOUR_ADDRESS'))"
```

### Getting Help

1. Check logs: `tail -f logs/app.log`
2. Verify environment: `python -c "from app.core.config import settings; print(vars(settings))"`
3. Test components individually using the verification commands above

## 📝 Next Steps

1. **Deploy to Production**: Use Render/Railway for hosting
2. **Domain Setup**: Configure custom domain
3. **SSL Certificate**: Enable HTTPS
4. **Monitoring**: Add Sentry for error tracking
5. **Backup**: Implement database backups
6. **Load Testing**: Test with concurrent users

---

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/           # API route handlers
│   ├── blockchain/    # Smart contract & Web3 client
│   ├── core/          # Configuration & database
│   ├── models/        # Data models
│   └── utils/         # Utility functions
├── tests/             # Unit tests
├── logs/              # Application logs
├── main.py           # FastAPI application
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

Built with ❤️ for Bangladesh 🇧🇩