import { useState } from "react";
import { CandidateCard } from "@/components/CandidateCard";
import { VoteConfirmationDialog } from "@/components/VoteConfirmationDialog";
import { NIDVerificationDialog } from "@/components/NIDVerificationDialog";
import { VoteVerificationModal } from "@/components/VoteVerificationModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, AlertTriangle } from "lucide-react";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-geo-data";
import { useLocation } from "wouter";
import { useVoting } from "@/lib/voting-context";

const mockCandidates = [
  {
    id: "1",
    name: "আবদুল করিম",
    nameEn: "Abdul Karim",
    candidateNumber: 101,
    party: "Jamaat-e-Islami",
    partyColor: "#2D8B3C",
    partyLogo: "/Party Logo/Jamaat-e-Islami.jpeg",
    hashId: "JAM-134",
  },
  {
    id: "2",
    name: "রহিমা খাতুন",
    nameEn: "Rahima Khatun",
    candidateNumber: 202,
    party: "BNP",
    partyColor: "#FF8C00",
    partyLogo: "/Party Logo/BNP.jpeg",
    hashId: "BNP-201",
  },
  {
    id: "3",
    name: "মোহাম্মদ আলী",
    nameEn: "Mohammad Ali",
    candidateNumber: 303,
    party: "NCP",
    partyColor: "#4169E1",
    partyLogo: "/Party Logo/NCP.jpeg",
    hashId: "NCP-089",
  },
  {
    id: "4",
    name: "ফাতেমা বেগম",
    nameEn: "Fatema Begum",
    candidateNumber: 404,
    party: "Jatiya Party",
    partyColor: "#DC143C",
    partyLogo: "/Party Logo/Jatiya Party.jpeg",
    hashId: "JAT-256",
  },
];

export default function VotePage() {
  const [, setLocation] = useLocation();
  const { startVerification, hasVoted, votedCandidateId, votingStatus, verificationTime } = useVoting();
  
  const [selectedDivision, setSelectedDivision] = useState("রাজশাহী");
  const [selectedDistrict, setSelectedDistrict] = useState("বগুড়া");
  const [selectedUpazila, setSelectedUpazila] = useState("আদমদিঘী");
  const [selectedWard, setSelectedWard] = useState("৫");
  
  const [districts, setDistricts] = useState<string[]>(getDistricts("রাজশাহী"));
  const [upazilas, setUpazilas] = useState<string[]>(getUpazilas("রাজশাহী", "বগুড়া"));

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [nidDialogOpen, setNIDDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null);

  const userRegisteredAddress = {
    division: "রাজশাহী",
    district: "বগুড়া",
    upazila: "আদমদিঘী",
    ward: "৫",
  };

  const isMatchingAddress = 
    selectedDivision === userRegisteredAddress.division &&
    selectedDistrict === userRegisteredAddress.district &&
    selectedUpazila === userRegisteredAddress.upazila &&
    selectedWard === userRegisteredAddress.ward;

  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict("");
    setSelectedUpazila("");
    setDistricts(getDistricts(value));
    setUpazilas([]);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedUpazila("");
    setUpazilas(getUpazilas(selectedDivision, value));
  };

  const handleVoteClick = (candidateId: string) => {
    if (hasVoted) {
      alert("আপনি ইতিমধ্যে ভোট দিয়েছেন!");
      return;
    }

    if (!isMatchingAddress) {
      alert("আপনি শুধুমাত্র আপনার নিবন্ধিত ঠিকানা থেকে ভোট দিতে পারবেন!");
      return;
    }

    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setConfirmDialogOpen(true);
    }
  };

  const handleVoteConfirm = () => {
    if (hasVoted) {
      setConfirmDialogOpen(false);
      setSelectedCandidate(null);
      return;
    }
    setConfirmDialogOpen(false);
    setNIDDialogOpen(true);
  };

  const handleVerificationComplete = () => {
    if (hasVoted) {
      setNIDDialogOpen(false);
      setSelectedCandidate(null);
      return;
    }
    
    setNIDDialogOpen(false);
    if (selectedCandidate) {
      startVerification(selectedCandidate.id);
      setSelectedCandidate(null);
    }
  };

  const handleVerificationModalComplete = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">ভোট দিন</h2>
        <p className="text-muted-foreground">আপনার প্রার্থী নির্বাচন করুন</p>
      </div>

      <Alert className="bg-primary/10 border-primary">
        <MapPin className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>আপনার নিবন্ধিত ঠিকানা:</strong> {userRegisteredAddress.division} → {userRegisteredAddress.district} → {userRegisteredAddress.upazila} → ওয়ার্ড {userRegisteredAddress.ward}
        </AlertDescription>
      </Alert>

      {!isMatchingAddress && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>সতর্কতা:</strong> আপনি শুধুমাত্র আপনার নিবন্ধিত ঠিকানার প্রার্থীদের দেখতে এবং ভোট দিতে পারবেন।
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>বিভাগ</Label>
          <Select value={selectedDivision} onValueChange={handleDivisionChange}>
            <SelectTrigger data-testid="select-vote-division">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getDivisions().map((division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>জেলা</Label>
          <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedDivision}>
            <SelectTrigger data-testid="select-vote-district">
              <SelectValue placeholder="জেলা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>উপজেলা</Label>
          <Select value={selectedUpazila} onValueChange={setSelectedUpazila} disabled={!selectedDistrict}>
            <SelectTrigger data-testid="select-vote-upazila">
              <SelectValue placeholder="উপজেলা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {upazilas.map((upazila) => (
                <SelectItem key={upazila} value={upazila}>
                  {upazila}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>ওয়ার্ড</Label>
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger data-testid="select-vote-ward">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"].map((ward) => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          প্রার্থীগণ ({selectedDivision} → {selectedDistrict} → {selectedUpazila} → ওয়ার্ড {selectedWard})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              {...candidate}
              onVote={handleVoteClick}
              hasVoted={hasVoted}
              isSelected={votedCandidateId === candidate.id}
              disabled={!isMatchingAddress}
            />
          ))}
        </div>
      </div>

      {selectedCandidate && (
        <>
          <VoteConfirmationDialog
            open={confirmDialogOpen}
            candidateName={selectedCandidate.name}
            candidateNameEn={selectedCandidate.nameEn}
            party={selectedCandidate.party}
            candidateNumber={selectedCandidate.candidateNumber}
            hashId={selectedCandidate.hashId}
            onConfirm={handleVoteConfirm}
            onCancel={() => setConfirmDialogOpen(false)}
          />
          
          <NIDVerificationDialog
            open={nidDialogOpen}
            onComplete={handleVerificationComplete}
            onCancel={() => setNIDDialogOpen(false)}
          />
        </>
      )}

      <VoteVerificationModal
        open={votingStatus === "verifying"}
        verificationTime={verificationTime}
        onComplete={handleVerificationModalComplete}
      />
    </div>
  );
}
