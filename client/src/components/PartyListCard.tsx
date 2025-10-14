import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";

const parties = [
  { name: "Jamaat-e-Islami", color: "#2D8B3C", shortName: "জামায়াত" },
  { name: "BNP", color: "#FF8C00", shortName: "বিএনপি" },
  { name: "NCP", color: "#4169E1", shortName: "এনসিপি" },
  { name: "Jatiya Party", color: "#DC143C", shortName: "জাতীয় পার্টি" },
];

export function PartyListCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          নির্বাচনে অংশগ্রহণকারী দল
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {parties.map((party) => (
            <div
              key={party.name}
              className="flex items-center gap-3 p-3 rounded-lg border hover-elevate"
              data-testid={`party-${party.name}`}
            >
              <div
                className="h-8 w-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: party.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{party.shortName}</p>
                <p className="text-xs text-muted-foreground truncate">{party.name}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
