"""
Web3 Client for Blockchain Interaction
Handles smart contract calls and transaction management
"""

import json
import os
from typing import Optional, Dict, Any
from web3 import Web3
from web3.contract import Contract
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Web3Client:
    def __init__(self):
        self.w3: Optional[Web3] = None
        self.contract: Optional[Contract] = None
        self.admin_account = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Web3 connection and contract"""
        try:
            # Connect to blockchain
            self.w3 = Web3(Web3.HTTPProvider(settings.rpc_url))
            
            if not self.w3.is_connected():
                raise Exception("Failed to connect to blockchain")
            
            logger.info(f"Connected to blockchain (Block: {self.w3.eth.block_number})")
            
            # Setup admin account
            self.admin_account = self.w3.eth.account.from_key(settings.admin_private_key)
            
            # Load contract
            self._load_contract()
            
        except Exception as e:
            logger.error(f"Failed to initialize Web3 client: {e}")
            raise
    
    def _load_contract(self):
        """Load smart contract"""
        if not settings.contract_address:
            logger.warning("Contract address not set")
            return
        
        try:
            # Try to load from contract_info.json
            contract_info_path = os.path.join(os.path.dirname(__file__), '..', '..', 'contract_info.json')
            
            if os.path.exists(contract_info_path):
                with open(contract_info_path, 'r') as f:
                    contract_info = json.load(f)
                
                self.contract = self.w3.eth.contract(
                    address=contract_info['address'],
                    abi=contract_info['abi']
                )
                logger.info(f"Contract loaded: {contract_info['address']}")
            else:
                logger.warning("contract_info.json not found. Deploy contract first.")
                
        except Exception as e:
            logger.error(f"Failed to load contract: {e}")
    
    def cast_vote_on_chain(self, voter_hash: str, candidate_id: int) -> Dict[str, Any]:
        """
        Cast vote on blockchain
        
        Args:
            voter_hash: SHA3 hash of voter NID + salt
            candidate_id: Candidate identifier
            
        Returns:
            Transaction receipt and details
        """
        if not self.contract:
            raise Exception("Contract not loaded")
        
        try:
            # Convert voter_hash to bytes32
            voter_hash_bytes = self.w3.keccak(text=voter_hash)
            
            # Check if voter already voted
            has_voted = self.contract.functions.hasVoterVoted(voter_hash_bytes).call()
            if has_voted:
                raise Exception("Voter has already voted")
            
            # Build transaction
            nonce = self.w3.eth.get_transaction_count(self.admin_account.address)
            
            transaction = self.contract.functions.castVote(
                voter_hash_bytes, 
                candidate_id
            ).build_transaction({
                'chainId': 80002,  # Polygon Amoy
                'gas': 200000,
                'gasPrice': self.w3.to_wei('30', 'gwei'),
                'nonce': nonce,
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, settings.admin_private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            logger.info(f"Vote transaction sent: {tx_hash.hex()}")
            
            # Wait for confirmation
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if tx_receipt.status == 1:
                logger.info(f"Vote confirmed in block {tx_receipt.blockNumber}")
                
                return {
                    'success': True,
                    'tx_hash': tx_hash.hex(),
                    'block_number': tx_receipt.blockNumber,
                    'gas_used': tx_receipt.gasUsed,
                    'voter_hash': voter_hash_bytes.hex(),
                    'candidate_id': candidate_id
                }
            else:
                raise Exception("Transaction failed")
                
        except Exception as e:
            logger.error(f"Failed to cast vote: {e}")
            raise
    
    def get_vote_count(self, candidate_id: int) -> int:
        """Get vote count for candidate"""
        if not self.contract:
            raise Exception("Contract not loaded")
        
        return self.contract.functions.getVoteCount(candidate_id).call()
    
    def get_total_votes(self) -> int:
        """Get total number of votes cast"""
        if not self.contract:
            raise Exception("Contract not loaded")
        
        return self.contract.functions.getTotalVotes().call()
    
    def has_voter_voted(self, voter_hash: str) -> bool:
        """Check if voter has already voted"""
        if not self.contract:
            raise Exception("Contract not loaded")
        
        voter_hash_bytes = self.w3.keccak(text=voter_hash)
        return self.contract.functions.hasVoterVoted(voter_hash_bytes).call()
    
    def get_vote_record(self, index: int) -> Dict[str, Any]:
        """Get vote record by index"""
        if not self.contract:
            raise Exception("Contract not loaded")
        
        record = self.contract.functions.getVoteRecord(index).call()
        
        return {
            'voter_hash': record[0].hex(),
            'candidate_id': record[1],
            'timestamp': record[2],
            'tx_hash': record[3].hex()
        }
    
    def is_voting_active(self) -> bool:
        """Check if voting is currently active"""
        if not self.contract:
            return False
        
        return self.contract.functions.votingActive().call()

# Global instance
web3_client = Web3Client()