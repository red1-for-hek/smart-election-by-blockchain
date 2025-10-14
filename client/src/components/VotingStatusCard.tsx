import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VotingStatusCardProps {
  status: "not_voted" | "verifying" | "voted";
  verificationTime?: number;
}

export function VotingStatusCard({ status, verificationTime }: VotingStatusCardProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "voted":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
          title: "আপনি ভোট দিয়েছেন",
          description: "আপনার ভোট সফলভাবে ব্লকচেইনে সংরক্ষিত হয়েছে",
          badge: <Badge className="bg-primary">সম্পন্ন</Badge>,
        };
      case "verifying":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />,
          title: "ভোট যাচাইকরণে আছে",
          description: `আপনার ভোট যাচাই করা হচ্ছে... (${verificationTime || 10} সেকেন্ড)`,
          badge: <Badge variant="outline" className="border-yellow-500 text-yellow-500">যাচাইকরণে</Badge>,
        };
      case "not_voted":
      default:
        return {
          icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
          title: "আপনি এখনও ভোট দেননি",
          description: "ভোট দিতে 'ভোট দিন' পেজে যান",
          badge: <Badge variant="outline">ভোট দেননি</Badge>,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {statusInfo.icon}
            ভোটের স্ট্যাটাস
          </span>
          {statusInfo.badge}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-semibold" data-testid="text-voting-status">{statusInfo.title}</p>
          <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
