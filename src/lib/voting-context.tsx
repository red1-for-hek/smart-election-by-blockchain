import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type VotingStatus = "not_voted" | "verifying" | "voted";

interface VotingContextType {
  votingStatus: VotingStatus;
  verificationTime: number;
  startVerification: (candidateId: string) => void;
  votedCandidateId: string | null;
  hasVoted: boolean;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export function VotingProvider({ children }: { children: ReactNode }) {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>("not_voted");
  const [verificationTime, setVerificationTime] = useState(10);
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);

  const startVerification = (candidateId: string) => {
    setVotingStatus("verifying");
    setVerificationTime(10);
    setVotedCandidateId(candidateId);
  };

  useEffect(() => {
    if (votingStatus === "verifying" && verificationTime > 0) {
      const timer = setTimeout(() => {
        setVerificationTime((prev) => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (votingStatus === "verifying" && verificationTime === 0) {
      setVotingStatus("voted");
    }
  }, [votingStatus, verificationTime]);

  const hasVoted = votingStatus === "voted" || votingStatus === "verifying";

  return (
    <VotingContext.Provider value={{ votingStatus, verificationTime, startVerification, votedCandidateId, hasVoted }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error("useVoting must be used within a VotingProvider");
  }
  return context;
}
