# 🚀 Complete Setup Guide

## Step 3: Update .env File

Edit the `.env` file with your actual values:

```bash
cd /workspaces/smart-election-by-blockchain/backend
nano .env
```

Replace with your actual values:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://voting_admin:YOUR_ACTUAL_PASSWORD@voting-cluster.xxxxx.mongodb.net/voting_system?retryWrites=true&w=majority

# Blockchain Configuration  
RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_ACTUAL_PROJECT_ID
CONTRACT_ADDRESS=  # Leave empty for now
ADMIN_PRIVATE_KEY=0xYOUR_ACTUAL_PRIVATE_KEY_FROM_METAMASK
ADMIN_ADDRESS=0xYOUR_ACTUAL_WALLET_ADDRESS_FROM_METAMASK

# Authentication
JWT_SECRET=bangladesh-voting-system-super-secret-key-change-in-production

# Face Verification
FACE_VERIFICATION_ENABLED=true

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

## Step 4: Deploy Smart Contract

```bash
# Make sure you're in backend directory
cd /workspaces/smart-election-by-blockchain/backend

# Deploy the smart contract
python app/blockchain/compile_and_deploy.py
```

**Expected Output:**
```
🏗️  Bangladesh Voting System - Contract Deployment
==================================================
🔧 Installing Solidity compiler...
📝 Compiling VoteContract.sol...
✅ Connected to blockchain (Block: 12345)
👤 Admin address: 0xYourAddress
💰 Balance: 0.1 MATIC
🚀 Deploying contract...
📤 Transaction sent: 0x1234...
⏳ Waiting for confirmation...
✅ Contract deployed successfully!
📍 Contract address: 0xContractAddress
📝 Updated .env with CONTRACT_ADDRESS=0xContractAddress
```

## Step 5: Start Backend Server

```bash
# Start the server
python main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     ✅ Database connected
INFO:     ✅ Blockchain client initialized  
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 6: Test API Endpoints

Open new terminal and test:

```bash
# Test health check
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "database": "connected", 
  "blockchain": "connected",
  "contract_loaded": true
}
```

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
```

## Step 7: Start Frontend

```bash
# In another terminal
cd /workspaces/smart-election-by-blockchain
npm run frontend:dev
```

## Troubleshooting

### MongoDB Connection Issues:
```bash
# Test MongoDB connection
python -c "
from pymongo import MongoClient
client = MongoClient('YOUR_MONGO_URI')
client.admin.command('ping')
print('✅ MongoDB Connected')
"
```

### Blockchain Connection Issues:
```bash
# Test blockchain connection  
python -c "
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL'))
print('Connected:', w3.is_connected())
print('Block:', w3.eth.block_number)
"
```

### Check Wallet Balance:
```bash
python -c "
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL'))
balance = w3.eth.get_balance('YOUR_WALLET_ADDRESS')
print('Balance:', w3.from_wei(balance, 'ether'), 'MATIC')
"
```

If balance is 0, get more test MATIC from: https://faucet.polygon.technology/

## Next Steps

1. ✅ Backend running on http://localhost:8000
2. ✅ Frontend running on http://localhost:3000  
3. ✅ Smart contract deployed
4. ✅ Database connected
5. 🎯 **Ready to test full voting system!**

Visit http://localhost:8000/docs for API documentation.