import { useState, useRef, useEffect } from "react";
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
import { Camera, CreditCard, User, CheckCircle2, AlertCircle } from "lucide-react";

interface NIDVerificationDialogProps {
  open: boolean;
  onComplete: (data: { nidFront: string; nidBack: string; face: string }) => void;
  onCancel: () => void;
  isPostal?: boolean;
}

export function NIDVerificationDialog({
  open,
  onComplete,
  onCancel,
  isPostal = false,
}: NIDVerificationDialogProps) {
  const [step, setStep] = useState<"nid-front" | "nid-back" | "face" | "passport">("nid-front");
  const [nidFrontImage, setNidFrontImage] = useState<string | null>(null);
  const [nidBackImage, setNidBackImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [passportImage, setPassportImage] = useState<string | null>(null);
  const [faceInstruction, setFaceInstruction] = useState<string>("মুখ সোজা রাখুন");
  const [faceVerified, setFaceVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open && (step === "nid-front" || step === "nid-back" || step === "face" || step === "passport")) {
      startCamera();
    }
    return () => stopCamera();
  }, [open, step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: step === "face" ? 640 : 1280 },
          height: { ideal: step === "face" ? 640 : 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL("image/jpeg");
      }
    }
    return null;
  };

  const handleCapture = () => {
    const image = captureImage();
    if (!image) return;

    if (step === "nid-front") {
      setNidFrontImage(image);
      stopCamera();
      setStep("nid-back");
    } else if (step === "nid-back") {
      setNidBackImage(image);
      stopCamera();
      if (isPostal) {
        setStep("passport");
      } else {
        setStep("face");
      }
    } else if (step === "passport") {
      setPassportImage(image);
      stopCamera();
      setStep("face");
    } else if (step === "face") {
      setFaceImage(image);
      setFaceVerified(true);
    }
  };

  const simulateFaceMovement = () => {
    const instructions = ["বামে ঘুরুন", "ডানে ঘুরুন", "মুখ সোজা রাখুন"];
    let index = 0;
    const interval = setInterval(() => {
      if (index < instructions.length) {
        setFaceInstruction(instructions[index]);
        index++;
      } else {
        clearInterval(interval);
        setFaceVerified(true);
      }
    }, 2000);
  };

  useEffect(() => {
    if (step === "face" && cameraActive) {
      simulateFaceMovement();
    }
  }, [step, cameraActive]);

  const handleComplete = () => {
    if (nidFrontImage && nidBackImage && faceImage) {
      onComplete({
        nidFront: nidFrontImage,
        nidBack: nidBackImage,
        face: faceImage,
      });
      resetDialog();
    }
  };

  const resetDialog = () => {
    setStep("nid-front");
    setNidFrontImage(null);
    setNidBackImage(null);
    setFaceImage(null);
    setPassportImage(null);
    setFaceVerified(false);
    stopCamera();
  };

  const handleCancel = () => {
    onCancel();
    resetDialog();
  };

  const getNIDRatio = () => {
    return "aspect-[1.586/1]"; // BD NID card ratio (85.6mm x 54mm)
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-2xl">
        {step === "nid-front" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                NID সামনের অংশ স্ক্যান করুন
              </DialogTitle>
              <DialogDescription>
                আপনার জাতীয় পরিচয়পত্রের সামনের অংশ ফ্রেমে রাখুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  NID কার্ডটি ফ্রেমের মধ্যে সম্পূর্ণভাবে রাখুন এবং স্পষ্ট দেখা যাচ্ছে কিনা নিশ্চিত করুন
                </AlertDescription>
              </Alert>

              <div className={`${getNIDRatio()} bg-black rounded-lg overflow-hidden border-2 border-primary relative`}>
                {cameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-white" />
                    <p className="text-white ml-2">ক্যামেরা চালু হচ্ছে...</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <Button onClick={handleCapture} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                ছবি তুলুন
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                বাতিল করুন
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "nid-back" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                NID পেছনের অংশ স্ক্যান করুন
              </DialogTitle>
              <DialogDescription>
                আপনার জাতীয় পরিচয়পত্রের পেছনের অংশ ফ্রেমে রাখুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  NID কার্ডের পেছনের অংশটি ফ্রেমের মধ্যে রাখুন
                </AlertDescription>
              </Alert>

              <div className={`${getNIDRatio()} bg-black rounded-lg overflow-hidden border-2 border-primary relative`}>
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <Button onClick={handleCapture} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                ছবি তুলুন
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                বাতিল করুন
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "passport" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                পাসপোর্ট স্ক্যান করুন
              </DialogTitle>
              <DialogDescription>
                আপনার পাসপোর্টের ছবি পৃষ্ঠা ফ্রেমে রাখুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  পাসপোর্টের ছবি পৃষ্ঠাটি স্পষ্টভাবে দেখা যাচ্ছে কিনা নিশ্চিত করুন
                </AlertDescription>
              </Alert>

              <div className="aspect-[1.4/1] bg-black rounded-lg overflow-hidden border-2 border-primary relative">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <Button onClick={handleCapture} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                ছবি তুলুন
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                বাতিল করুন
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "face" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                মুখ যাচাইকরণ
              </DialogTitle>
              <DialogDescription>
                নির্দেশনা অনুসরণ করুন এবং আপনার মুখ ক্যামেরায় রাখুন
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-semibold text-lg">
                  {faceInstruction}
                </AlertDescription>
              </Alert>

              <div className="aspect-square max-w-md mx-auto bg-black rounded-full overflow-hidden border-4 border-primary relative">
                {cameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="h-16 w-16 text-white" />
                    <p className="text-white ml-2">ক্যামেরা চালু হচ্ছে...</p>
                  </div>
                )}
              </div>

              {faceVerified && (
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600">যাচাইকরণ সম্পন্ন! এখন ছবি তুলুন</p>
                </div>
              )}

              <Button 
                onClick={handleCapture} 
                className="w-full" 
                size="lg"
                disabled={!faceVerified}
              >
                <Camera className="mr-2 h-5 w-5" />
                ছবি তুলুন
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                বাতিল করুন
              </Button>
              {faceImage && (
                <Button onClick={handleComplete}>
                  যাচাইকরণ সম্পন্ন করুন
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
