import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserIdentityCardProps {
  name: string;
  accountType: string;
  nid: string;
}

export function UserIdentityCard({ name, accountType, nid }: UserIdentityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          পরিচয় তথ্য
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">পূর্ণ নাম</p>
            <p className="font-semibold text-lg" data-testid="text-user-name">{name}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">অ্যাকাউন্ট ধরন</p>
            <Badge variant="outline" data-testid="badge-account-type">
              {accountType}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">NID নম্বর</p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <code className="font-mono font-semibold" data-testid="text-nid">{nid}</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
