import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Search } from "lucide-react";

interface VoteRecord {
  nid: string;
  candidateName: string;
  candidateNameEn: string;
  party: string;
  blockHash: string;
  timestamp: string;
  candidateHashId: string;
}

export function VoteVerification() {
  const [nid, setNid] = useState("");
  const [voteRecord, setVoteRecord] = useState<VoteRecord | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nid === "1234567890") {
      setVoteRecord({
        nid: "1234567890",
        candidateName: "আবদুল করিম",
        candidateNameEn: "Abdul Karim",
        party: "Jamaat-e-Islami",
        blockHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        timestamp: new Date().toLocaleString('bn-BD'),
        candidateHashId: "JAM-134",
      });
    } else {
      setVoteRecord(null);
    }
    // Vote verification will be handled by blockchain API
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">ভোট যাচাই করুন</h2>
        <p className="text-muted-foreground">আপনার NID নম্বর দিয়ে ভোটের রেকর্ড দেখুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NID নম্বর দিন</CardTitle>
          <CardDescription>আপনার ভোটের তথ্য দেখতে জাতীয় পরিচয়পত্র নম্বর লিখুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="verify-nid" className="sr-only">NID নম্বর</Label>
              <Input
                id="verify-nid"
                type="text"
                placeholder="১২৩৪৫৬৭৮৯০"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                data-testid="input-verify-nid"
                required
              />
            </div>
            <Button type="submit" data-testid="button-verify">
              <Search className="mr-2 h-4 w-4" />
              যাচাই করুন
            </Button>
          </form>
        </CardContent>
      </Card>

      {voteRecord && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <CardTitle>ভোট যাচাইকৃত</CardTitle>
            </div>
            <CardDescription>আপনার ভোট সফলভাবে ব্লকচেইনে সংরক্ষিত হয়েছে</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">প্রার্থী</Label>
                <p className="font-semibold">{voteRecord.candidateName}</p>
                <p className="text-sm text-muted-foreground">{voteRecord.candidateNameEn}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">রাজনৈতিক দল</Label>
                <p className="font-semibold">{voteRecord.party}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">প্রার্থী হ্যাশ ID</Label>
                <Badge variant="outline" className="font-mono">{voteRecord.candidateHashId}</Badge>
              </div>
              
              <div>
                <Label className="text-muted-foreground">সময়</Label>
                <p className="text-sm">{voteRecord.timestamp}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground">ব্লক হ্যাশ</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <code className="text-xs font-mono break-all">{voteRecord.blockHash}</code>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>ব্লকচেইন যাচাইকৃত</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
