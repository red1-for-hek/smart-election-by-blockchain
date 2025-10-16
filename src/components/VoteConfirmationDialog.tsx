import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VoteConfirmationDialogProps {
  open: boolean;
  candidateName: string;
  candidateNameEn: string;
  party: string;
  candidateNumber: number;
  hashId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VoteConfirmationDialog({
  open,
  candidateName,
  candidateNameEn,
  party,
  candidateNumber,
  hashId,
  onConfirm,
  onCancel,
}: VoteConfirmationDialogProps) {
  const handleContinue = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            ভোট নিশ্চিত করুন
          </DialogTitle>
          <DialogDescription>
            আপনি কি নিশ্চিত যে আপনি এই প্রার্থীকে ভোট দিতে চান?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>গুরুত্বপূর্ণ:</strong> একবার ভোট দিলে পরিবর্তন করা যাবে না।
            </AlertDescription>
          </Alert>

          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">প্রার্থীর নাম</p>
              <p className="font-semibold">{candidateName}</p>
              <p className="text-sm text-muted-foreground">{candidateNameEn}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">রাজনৈতিক দল</p>
                <p className="font-medium">{party}</p>
              </div>
              <Badge variant="outline">#{candidateNumber}</Badge>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">প্রার্থী হ্যাশ ID</p>
              <code className="text-sm font-mono">{hashId}</code>
            </div>
          </div>

          <Alert className="bg-primary/10 border-primary">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              পরবর্তী ধাপে NID যাচাইকরণ প্রয়োজন হবে
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel-vote">
            বাতিল করুন
          </Button>
          <Button onClick={handleContinue} data-testid="button-continue-vote">
            নিশ্চিত করুন ও এগিয়ে যান
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
