import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Phone, Calendar } from "lucide-react";

interface VoterProfileProps {
  name: string;
  nameEn: string;
  nid: string;
  address: string;
  mobile: string;
  hasVoted: boolean;
  registrationDate: string;
  pollingCenter: string;
}

export function VoterProfile({
  name,
  nameEn,
  nid,
  address,
  mobile,
  hasVoted,
  registrationDate,
  pollingCenter,
}: VoterProfileProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">ভোটার প্রোফাইল</h2>
        <p className="text-muted-foreground">আপনার ভোটার তথ্য</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground">{nameEn}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {hasVoted ? (
                  <Badge className="gap-1 bg-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    ভোট দেওয়া হয়েছে
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    ভোট বাকি
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">জাতীয় পরিচয়পত্র নম্বর</p>
              <p className="font-mono font-semibold">{nid}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">মোবাইল নম্বর</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{mobile}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ঠিকানা</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <p className="font-medium">{address}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">নিবন্ধনের তারিখ</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{registrationDate}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">ভোটকেন্দ্র</p>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="font-medium">{pollingCenter}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
