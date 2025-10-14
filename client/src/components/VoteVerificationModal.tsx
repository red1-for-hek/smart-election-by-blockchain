import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface VoteVerificationModalProps {
  open: boolean;
  verificationTime: number;
  onComplete: () => void;
}

export function VoteVerificationModal({ open, verificationTime, onComplete }: VoteVerificationModalProps) {
  const progress = ((10 - verificationTime) / 10) * 100;
  const isComplete = verificationTime === 0;

  useEffect(() => {
    if (isComplete && open) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, open, onComplete]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-vote-verification">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isComplete ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                যাচাইকরণ সম্পন্ন
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ভোট যাচাইকরণ চলছে
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? "আপনার ভোট সফলভাবে ব্লকচেইনে রেকর্ড করা হয়েছে" 
              : "আপনার ভোট ব্লকচেইনে যাচাই করা হচ্ছে..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Progress value={progress} className="w-full" />
          
          <div className="text-center">
            {isComplete ? (
              <p className="text-sm text-muted-foreground">ড্যাশবোর্ডে ফিরে যাচ্ছে...</p>
            ) : (
              <p className="text-2xl font-bold" data-testid="text-verification-time">
                {verificationTime} সেকেন্ড
              </p>
            )}
          </div>

          {!isComplete && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ NID যাচাইকরণ সম্পন্ন</p>
              <p>✓ ফেস ভেরিফিকেশন সম্পন্ন</p>
              <p className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                ব্লকচেইনে ভোট রেকর্ড করা হচ্ছে
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
