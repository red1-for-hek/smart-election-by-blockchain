import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Phone, Mail } from "lucide-react";

export function HelpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          সহায়তা প্রয়োজন?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">হেল্পলাইন</p>
              <p className="font-semibold" data-testid="text-helpline">১৬৩৩৩</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">ইমেইল</p>
              <p className="font-semibold text-sm" data-testid="text-email">support@votingsystem.gov.bd</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
