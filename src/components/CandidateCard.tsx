import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface CandidateCardProps {
  id: string;
  name: string;
  nameEn: string;
  candidateNumber: number;
  party: string;
  partyColor: string;
  partyLogo: string;
  hashId: string;
  photoUrl?: string;
  onVote: (candidateId: string) => void;
  hasVoted: boolean;
  isSelected: boolean;
  disabled?: boolean;
}

export function CandidateCard({
  id,
  name,
  nameEn,
  candidateNumber,
  party,
  partyColor,
  partyLogo,
  hashId,
  photoUrl,
  onVote,
  hasVoted,
  isSelected,
  disabled = false,
}: CandidateCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: partyColor }} />
      
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={partyLogo} alt={party} />
            <AvatarFallback className="text-lg">
              <img src={partyLogo} alt={party} className="w-full h-full object-cover" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{name}</h3>
                <p className="text-sm text-muted-foreground">{nameEn}</p>
              </div>
              <Badge variant="outline" className="shrink-0">
                #{candidateNumber}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2" style={{ borderColor: partyColor, backgroundColor: `${partyColor}20` }} />
              <span className="text-sm font-medium">{party}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {hashId}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onVote(id)}
          disabled={hasVoted || disabled}
          data-testid={`button-vote-${id}`}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ভোট দেওয়া হয়েছে
            </>
          ) : hasVoted ? (
            'ভোট দেওয়া শেষ'
          ) : (
            'ভোট দিন'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
