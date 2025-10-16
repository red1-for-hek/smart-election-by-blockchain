#!/bin/bash

echo "🚀 Setting up Bangladesh Voting System Backend..."

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Solidity compiler
echo "🔧 Installing Solidity compiler..."
python -c "from solcx import install_solc; install_solc('0.8.19')"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p tests
mkdir -p app/models
mkdir -p app/utils

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your values"
echo "2. Set up MongoDB Atlas (free tier)"
echo "3. Get Infura/Alchemy API key for Polygon Mumbai"
echo "4. Create Ethereum wallet for admin operations"
echo "5. Run: python main.py"