import { UserIdentityCard } from "@/components/UserIdentityCard";
import { VotingStatusCard } from "@/components/VotingStatusCard";
import { PartyListCard } from "@/components/PartyListCard";
import { HelpCard } from "@/components/HelpCard";
import { useVoting } from "@/lib/voting-context";

export default function DashboardPage() {
  const { votingStatus, verificationTime } = useVoting();
  
  const userData = {
    name: "রেদওয়ানুল হক",
    accountType: "ভোটার অ্যাকাউন্ট",
    nid: "1234567890",
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">ড্যাশবোর্ড</h2>
        <p className="text-muted-foreground">আপনার ভোটিং তথ্য এক নজরে</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserIdentityCard
          name={userData.name}
          accountType={userData.accountType}
          nid={userData.nid}
        />
        
        <VotingStatusCard status={votingStatus} verificationTime={verificationTime} />
      </div>

      <PartyListCard />

      <HelpCard />
    </div>
  );
}
