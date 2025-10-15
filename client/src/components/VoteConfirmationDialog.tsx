import { useState } from "react";
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
import { Camera, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
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
  const [step, setStep] = useState<"confirm" | "photo" | "processing" | "success">("confirm");
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleContinue = () => {
    if (step === "confirm") {
      setStep("photo");
    } else if (step === "photo" && photoTaken) {
      setStep("processing");
      setTimeout(() => {
        setStep("success");
        setTimeout(() => {
          onConfirm();
          resetDialog();
        }, 2000);
      }, 1500);
    }
  };

  const handleTakePhoto = () => {
    // Simulate photo capture
    // Photo captured for vote verification
    setPhotoTaken(true);
  };

  const resetDialog = () => {
    setStep("confirm");
    setPhotoTaken(false);
  };

  const handleCancel = () => {
    onCancel();
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" && (
          <>
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
                  পরবর্তী ধাপে ফটো যাচাইকরণ প্রয়োজন হবে
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-vote">
                বাতিল করুন
              </Button>
              <Button onClick={handleContinue} data-testid="button-continue-vote">
                নিশ্চিত করুন ও এগিয়ে যান
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "photo" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                ফটো যাচাইকরণ
              </DialogTitle>
              <DialogDescription>
                আপনার পরিচয় যাচাই করতে একটি ফটো তুলুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  ক্যামেরার সামনে থাকুন এবং "ফটো তুলুন" বাটনে ক্লিক করুন
                </AlertDescription>
              </Alert>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {photoTaken ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">ফটো সফলভাবে নেওয়া হয়েছে</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">ক্যামেরা ভিউ</p>
                  </div>
                )}
              </div>

              {!photoTaken && (
                <Button 
                  onClick={handleTakePhoto} 
                  className="w-full"
                  data-testid="button-take-photo"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  ফটো তুলুন
                </Button>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-photo">
                বাতিল করুন
              </Button>
              <Button 
                onClick={handleContinue} 
                disabled={!photoTaken}
                data-testid="button-submit-vote"
              >
                ভোট জমা দিন
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <div className="py-8 text-center">
            <div className="inline-flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent mb-4" />
            <h3 className="text-lg font-semibold mb-2">ভোট প্রক্রিয়া হচ্ছে...</h3>
            <p className="text-sm text-muted-foreground">আপনার ভোট ব্লকচেইনে সংরক্ষণ করা হচ্ছে</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">সফলভাবে ভোট দেওয়া হয়েছে!</h3>
            <p className="text-sm text-muted-foreground">আপনার ভোট ব্লকচেইনে নিরাপদে সংরক্ষিত হয়েছে</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
