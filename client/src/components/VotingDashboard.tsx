import { useState } from "react";
import { CandidateCard } from "./CandidateCard";
import { VoteConfirmationDialog } from "./VoteConfirmationDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-geo-data";

const mockCandidates = [
  {
    id: "1",
    name: "আবদুল করিম",
    nameEn: "Abdul Karim",
    candidateNumber: 101,
    party: "Jamaat-e-Islami",
    partyColor: "#2D8B3C",
    hashId: "JAM-134",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ধামরাই",
    ward: "৩",
  },
  {
    id: "2",
    name: "রহিমা খাতুন",
    nameEn: "Rahima Khatun",
    candidateNumber: 202,
    party: "BNP",
    partyColor: "#FF8C00",
    hashId: "BNP-201",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ধামরাই",
    ward: "৩",
  },
  {
    id: "3",
    name: "মোহাম্মদ আলী",
    nameEn: "Mohammad Ali",
    candidateNumber: 303,
    party: "NCP",
    partyColor: "#4169E1",
    hashId: "NCP-089",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ধামরাই",
    ward: "৩",
  },
  {
    id: "4",
    name: "ফাতেমা বেগম",
    nameEn: "Fatema Begum",
    candidateNumber: 404,
    party: "Jatiya Party",
    partyColor: "#DC143C",
    hashId: "JAT-256",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ধামরাই",
    ward: "৩",
  },
];

interface VotingDashboardProps {
  voterName: string;
}

export function VotingDashboard({ voterName }: VotingDashboardProps) {
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState("ঢাকা");
  const [selectedDistrict, setSelectedDistrict] = useState("ঢাকা");
  const [selectedUpazila, setSelectedUpazila] = useState("ধামরাই");
  const [selectedWard, setSelectedWard] = useState("৩");
  
  const [districts, setDistricts] = useState<string[]>(getDistricts("ঢাকা"));
  const [upazilas, setUpazilas] = useState<string[]>(getUpazilas("ঢাকা", "ঢাকা"));

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null);

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
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setConfirmDialogOpen(true);
    }
  };

  const handleVoteConfirm = () => {
    if (selectedCandidate) {
      setVotedCandidateId(selectedCandidate.id);
      setConfirmDialogOpen(false);
      console.log('Vote confirmed for candidate:', selectedCandidate.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">ভোটিং ড্যাশবোর্ড</h2>
        <p className="text-muted-foreground">স্বাগতম, {voterName}</p>
        
        {votedCandidateId ? (
          <Alert className="bg-primary/10 border-primary">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              <strong>আপনি সফলভাবে ভোট দিয়েছেন!</strong> আপনার ভোট ব্লকচেইনে সংরক্ষিত হয়েছে।
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              আপনি এখনও ভোট দেননি। নিচের প্রার্থীদের থেকে একজনকে নির্বাচন করুন।
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>বিভাগ</Label>
          <Select value={selectedDivision} onValueChange={handleDivisionChange}>
            <SelectTrigger data-testid="select-division">
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
            <SelectTrigger data-testid="select-district">
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
            <SelectTrigger data-testid="select-upazila">
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
            <SelectTrigger data-testid="select-ward">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="১">১</SelectItem>
              <SelectItem value="২">২</SelectItem>
              <SelectItem value="৩">৩</SelectItem>
              <SelectItem value="৪">৪</SelectItem>
              <SelectItem value="৫">৫</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">প্রার্থীগণ ({selectedDivision} → {selectedDistrict} → {selectedUpazila} → ওয়ার্ড {selectedWard})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              {...candidate}
              onVote={handleVoteClick}
              hasVoted={votedCandidateId !== null}
              isSelected={votedCandidateId === candidate.id}
            />
          ))}
        </div>
      </div>

      {selectedCandidate && (
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
      )}
    </div>
  );
}
