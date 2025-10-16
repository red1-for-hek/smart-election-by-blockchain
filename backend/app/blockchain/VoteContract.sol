// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VoteContract
 * @dev Simple voting contract for Bangladesh National Election System
 * Privacy: Only stores hashed voter IDs and candidate IDs on-chain
 * Real voter identity mapping is kept off-chain in encrypted database
 */
contract VoteContract {
    address public admin;
    bool public votingActive;
    
    // Events
    event VoteCast(bytes32 indexed voterHash, uint256 indexed candidateId, uint256 timestamp);
    event VotingStatusChanged(bool active);
    
    // Mappings
    mapping(bytes32 => bool) public hasVoted;  // voterHash => voted status
    mapping(uint256 => uint256) public voteCounts;  // candidateId => vote count
    
    // Vote records for transparency
    struct VoteRecord {
        bytes32 voterHash;
        uint256 candidateId;
        uint256 timestamp;
        bytes32 txHash;
    }
    
    VoteRecord[] public voteRecords;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        votingActive = true;
    }
    
    /**
     * @dev Cast a vote
     * @param voterHash SHA3 hash of voter's NID + salt (privacy protection)
     * @param candidateId Candidate identifier
     */
    function castVote(bytes32 voterHash, uint256 candidateId) 
        external 
        votingIsActive 
    {
        require(!hasVoted[voterHash], "Voter has already voted");
        require(candidateId > 0, "Invalid candidate ID");
        
        // Mark voter as voted
        hasVoted[voterHash] = true;
        
        // Increment vote count
        voteCounts[candidateId]++;
        
        // Store vote record
        voteRecords.push(VoteRecord({
            voterHash: voterHash,
            candidateId: candidateId,
            timestamp: block.timestamp,
            txHash: blockhash(block.number - 1)
        }));
        
        emit VoteCast(voterHash, candidateId, block.timestamp);
    }
    
    /**
     * @dev Get vote count for a candidate
     */
    function getVoteCount(uint256 candidateId) external view returns (uint256) {
        return voteCounts[candidateId];
    }
    
    /**
     * @dev Check if a voter hash has voted
     */
    function hasVoterVoted(bytes32 voterHash) external view returns (bool) {
        return hasVoted[voterHash];
    }
    
    /**
     * @dev Get total number of votes cast
     */
    function getTotalVotes() external view returns (uint256) {
        return voteRecords.length;
    }
    
    /**
     * @dev Get vote record by index
     */
    function getVoteRecord(uint256 index) external view returns (VoteRecord memory) {
        require(index < voteRecords.length, "Invalid index");
        return voteRecords[index];
    }
    
    /**
     * @dev Toggle voting status (admin only)
     */
    function toggleVoting() external onlyAdmin {
        votingActive = !votingActive;
        emit VotingStatusChanged(votingActive);
    }
    
    /**
     * @dev Emergency stop voting (admin only)
     */
    function stopVoting() external onlyAdmin {
        votingActive = false;
        emit VotingStatusChanged(false);
    }
}