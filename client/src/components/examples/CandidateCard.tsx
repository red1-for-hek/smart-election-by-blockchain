import { useState } from 'react';
import { CandidateCard } from '../CandidateCard';

export default function CandidateCardExample() {
  const [votedId, setVotedId] = useState<string | null>(null);

  const handleVote = (candidateId: string) => {
    setVotedId(candidateId);
    console.log('Voted for candidate:', candidateId);
  };

  return (
    <div className="p-8 max-w-md">
      <CandidateCard
        id="1"
        name="আবদুল করিম"
        nameEn="Abdul Karim"
        candidateNumber={101}
        party="Jamaat-e-Islami"
        partyColor="#2D8B3C"
        hashId="JAM-134"
        onVote={handleVote}
        hasVoted={votedId !== null}
        isSelected={votedId === "1"}
      />
    </div>
  );
}
