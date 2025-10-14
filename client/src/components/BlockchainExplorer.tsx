import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Shield } from "lucide-react";

const mockBlocks = [
  {
    blockNumber: 1045,
    previousHash: "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    currentHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    timestamp: "২০২৪-০১-১৫ ১৪:৩০:২৫",
    transactions: 1,
    candidateHashId: "JAM-134",
  },
  {
    blockNumber: 1044,
    previousHash: "0xfcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    currentHash: "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    timestamp: "২০২৪-০১-১৫ ১৪:২৮:১২",
    transactions: 1,
    candidateHashId: "BNP-201",
  },
  {
    blockNumber: 1043,
    previousHash: "0xef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c",
    currentHash: "0xfcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    timestamp: "২০২৪-০১-১৫ ১৪:২৫:৪৮",
    transactions: 1,
    candidateHashId: "NCP-089",
  },
];

export function BlockchainExplorer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">ব্লকচেইন এক্সপ্লোরার</h2>
        <p className="text-muted-foreground">সম্পূর্ণ ভোট চেইন দেখুন এবং যাচাই করুন</p>
      </div>

      <div className="space-y-4">
        {mockBlocks.map((block, index) => (
          <Card key={block.blockNumber} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">ব্লক #{block.blockNumber.toLocaleString('bn-BD')}</CardTitle>
                  <CardDescription>{block.timestamp}</CardDescription>
                </div>
                <Badge variant="outline" className="gap-2">
                  <Shield className="h-3 w-3" />
                  যাচাইকৃত
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">বর্তমান হ্যাশ</p>
                  <code className="text-xs font-mono bg-muted p-2 rounded block break-all">
                    {block.currentHash}
                  </code>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">পূর্ববর্তী হ্যাশ</p>
                  <code className="text-xs font-mono bg-muted p-2 rounded block break-all">
                    {block.previousHash}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {block.transactions.toLocaleString('bn-BD')} লেনদেন
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {block.candidateHashId}
                  </Badge>
                </div>
              </div>
            </CardContent>
            
            {index < mockBlocks.length - 1 && (
              <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 z-10">
                <div className="bg-background p-1 rounded-full border">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
