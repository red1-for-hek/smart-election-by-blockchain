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
import { Camera, CreditCard, User, CheckCircle2 } from "lucide-react";

interface NIDVerificationDialogProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function NIDVerificationDialog({
  open,
  onComplete,
  onCancel,
}: NIDVerificationDialogProps) {
  const [step, setStep] = useState<"front" | "back" | "face">("front");
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);

  const handleCaptureFront = () => {
    console.log("NID front captured");
    setFrontCaptured(true);
  };

  const handleCaptureBack = () => {
    console.log("NID back captured");
    setBackCaptured(true);
  };

  const handleCaptureFace = () => {
    console.log("Face captured");
    setFaceCaptured(true);
  };

  const handleContinue = () => {
    if (step === "front" && frontCaptured) {
      setStep("back");
    } else if (step === "back" && backCaptured) {
      setStep("face");
    } else if (step === "face" && faceCaptured) {
      onComplete();
      resetDialog();
    }
  };

  const resetDialog = () => {
    setStep("front");
    setFrontCaptured(false);
    setBackCaptured(false);
    setFaceCaptured(false);
  };

  const handleCancel = () => {
    onCancel();
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        {step === "front" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                NID সামনের অংশ
              </DialogTitle>
              <DialogDescription>
                আপনার NID কার্ডের সামনের অংশের ছবি তুলুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  NID কার্ডটি ফ্রেমের মধ্যে রাখুন এবং "ছবি তুলুন" বাটনে ক্লিক করুন
                </AlertDescription>
              </Alert>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {frontCaptured ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">NID সামনের অংশ সফলভাবে নেওয়া হয়েছে</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">NID সামনের অংশ</p>
                  </div>
                )}
              </div>

              {!frontCaptured && (
                <Button
                  onClick={handleCaptureFront}
                  className="w-full"
                  data-testid="button-capture-nid-front"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  ছবি তুলুন
                </Button>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-nid">
                বাতিল করুন
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!frontCaptured}
                data-testid="button-continue-nid-front"
              >
                পরবর্তী
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "back" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                NID পেছনের অংশ
              </DialogTitle>
              <DialogDescription>
                আপনার NID কার্ডের পেছনের অংশের ছবি তুলুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  NID কার্ডের পেছনের অংশটি ফ্রেমের মধ্যে রাখুন
                </AlertDescription>
              </Alert>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {backCaptured ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">NID পেছনের অংশ সফলভাবে নেওয়া হয়েছে</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">NID পেছনের অংশ</p>
                  </div>
                )}
              </div>

              {!backCaptured && (
                <Button
                  onClick={handleCaptureBack}
                  className="w-full"
                  data-testid="button-capture-nid-back"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  ছবি তুলুন
                </Button>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-nid-back">
                বাতিল করুন
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!backCaptured}
                data-testid="button-continue-nid-back"
              >
                পরবর্তী
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "face" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                মুখের ছবি
              </DialogTitle>
              <DialogDescription>
                আপনার মুখের ছবি তুলুন যাচাইকরণের জন্য
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  ক্যামেরার সামনে সরাসরি তাকিয়ে থাকুন
                </AlertDescription>
              </Alert>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                {faceCaptured ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">মুখের ছবি সফলভাবে নেওয়া হয়েছে</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">মুখের ছবি</p>
                  </div>
                )}
              </div>

              {!faceCaptured && (
                <Button
                  onClick={handleCaptureFace}
                  className="w-full"
                  data-testid="button-capture-face"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  ছবি তুলুন
                </Button>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-face">
                বাতিল করুন
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!faceCaptured}
                data-testid="button-submit-verification"
              >
                যাচাইকরণ জমা দিন
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
