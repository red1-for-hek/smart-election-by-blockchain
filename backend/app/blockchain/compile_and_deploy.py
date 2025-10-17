#!/usr/bin/env python3
"""
Smart Contract Compilation and Deployment Script
Compiles VoteContract.sol and deploys to Polygon Mumbai testnet
"""

import os
import json
from solcx import compile_source, install_solc, set_solc_version
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def compile_contract():
    """Compile the VoteContract.sol"""
    print("🔧 Installing Solidity compiler...")
    install_solc('0.8.19')
    set_solc_version('0.8.19')
    
    # Read contract source
    contract_path = os.path.join(os.path.dirname(__file__), 'VoteContract.sol')
    with open(contract_path, 'r') as file:
        contract_source = file.read()
    
    print("📝 Compiling VoteContract.sol...")
    compiled_sol = compile_source(contract_source)
    
    # Get contract interface
    contract_id, contract_interface = compiled_sol.popitem()
    
    # Extract bytecode and ABI
    return {
        'abi': contract_interface['abi'],
        'bytecode': contract_interface['bin']
    }

def deploy_contract():
    """Deploy contract to blockchain"""
    # Compile contract
    contract_interface = compile_contract()
    
    # Connect to blockchain
    rpc_url = os.getenv('RPC_URL')
    if not rpc_url:
        print("❌ RPC_URL not found in .env file")
        return None
        
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        print("❌ Failed to connect to blockchain")
        return None
    
    print(f"✅ Connected to blockchain (Block: {w3.eth.block_number})")
    
    # Get admin account
    private_key = os.getenv('ADMIN_PRIVATE_KEY')
    if not private_key:
        print("❌ ADMIN_PRIVATE_KEY not found in .env file")
        return None
        
    account = w3.eth.account.from_key(private_key)
    admin_address = account.address
    
    print(f"👤 Admin address: {admin_address}")
    
    # Check balance
    balance = w3.eth.get_balance(admin_address)
    balance_eth = w3.from_wei(balance, 'ether')
    print(f"💰 Balance: {balance_eth} MATIC")
    
    if balance == 0:
        print("❌ Insufficient balance. Get test MATIC from: https://faucet.polygon.technology/")
        return None
    
    # Deploy contract
    print("🚀 Deploying contract...")
    
    contract = w3.eth.contract(
        abi=contract_interface['abi'],
        bytecode=contract_interface['bytecode']
    )
    
    # Build transaction
    nonce = w3.eth.get_transaction_count(admin_address)
    
    transaction = contract.constructor().build_transaction({
        'chainId': 80002,  # Polygon Amoy
        'gas': 2000000,
        'gasPrice': w3.to_wei('30', 'gwei'),
        'nonce': nonce,
    })
    
    # Sign and send transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    print(f"📤 Transaction sent: {tx_hash.hex()}")
    print("⏳ Waiting for confirmation...")
    
    # Wait for transaction receipt
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    if tx_receipt.status == 1:
        contract_address = tx_receipt.contractAddress
        print(f"✅ Contract deployed successfully!")
        print(f"📍 Contract address: {contract_address}")
        print(f"⛽ Gas used: {tx_receipt.gasUsed}")
        
        # Save contract info
        contract_info = {
            'address': contract_address,
            'abi': contract_interface['abi'],
            'tx_hash': tx_hash.hex(),
            'block_number': tx_receipt.blockNumber
        }
        
        # Save to file
        with open('contract_info.json', 'w') as f:
            json.dump(contract_info, f, indent=2)
        
        # Update .env file
        update_env_file(contract_address)
        
        return contract_address
    else:
        print("❌ Contract deployment failed")
        return None

def update_env_file(contract_address):
    """Update .env file with contract address"""
    env_path = '.env'
    
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        # Update or add CONTRACT_ADDRESS
        updated = False
        for i, line in enumerate(lines):
            if line.startswith('CONTRACT_ADDRESS='):
                lines[i] = f'CONTRACT_ADDRESS={contract_address}\n'
                updated = True
                break
        
        if not updated:
            lines.append(f'CONTRACT_ADDRESS={contract_address}\n')
        
        with open(env_path, 'w') as f:
            f.writelines(lines)
        
        print(f"📝 Updated .env with CONTRACT_ADDRESS={contract_address}")

if __name__ == "__main__":
    print("🏗️  Bangladesh Voting System - Contract Deployment")
    print("=" * 50)
    
    contract_address = deploy_contract()
    
    if contract_address:
        print("\n🎉 Deployment completed successfully!")
        print(f"Contract Address: {contract_address}")
        print("\nNext steps:")
        print("1. Update your .env file with the contract address")
        print("2. Start the backend server: python main.py")
        print("3. Test the API endpoints")
    else:
        print("\n❌ Deployment failed. Check the errors above.")