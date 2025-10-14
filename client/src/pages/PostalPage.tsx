import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Clock, MapPin, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VotingDashboard } from "@/components/VotingDashboard";

export default function PostalPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            Postal Voting
          </h2>
          <p className="text-muted-foreground">প্রবাসী ভোটারদের জন্য বিশেষ ভোটিং</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          আন্তর্জাতিক
        </Badge>
      </div>

      <Alert className="bg-primary/10 border-primary">
        <MapPin className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>বিশেষ নোট:</strong> প্রবাসী ভোটারদের জন্য ফটো যাচাইকরণ বাধ্যতামূলক। আপনার পাসপোর্ট/IC সাথে রাখুন।
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>সময় অঞ্চল তথ্য</CardTitle>
          <CardDescription>আপনার স্থানীয় সময়ে ভোট দিতে পারবেন</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="font-medium">বর্তমান সময়: {new Date().toLocaleString('bn-BD')}</p>
          </div>
        </CardContent>
      </Card>

      <VotingDashboard voterName="প্রবাসী ভোটার" />
    </div>
  );
}
