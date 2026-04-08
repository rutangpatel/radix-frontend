"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { faceService } from "@/lib/api/services";

interface ReceiveFaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCallback?: () => void;
}

export function ReceiveFaceModal({ isOpen, onClose, onSuccessCallback }: ReceiveFaceModalProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      // Reset state so that nothing lingers on next open
      setStep(1);
      setAmount("");
      setRemark("");
      setErrorMsg(null);
      setSuccess(false);
      setIsProcessing(false);
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleNextStep = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    setStep(2);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast({
        title: "Camera Access Error",
        description: "Please allow camera access to receive payment.",
        variant: "destructive"
      });
      setStep(1);
    }
  };

  const captureAndCharge = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      
      try {
        await faceService.facePayment(file, Number(amount), remark);
        
        setSuccess(true);
        stopCamera();
        
        toast({
          title: "Payment Received",
          description: `Successfully received ₦${amount}.`,
        });

        setTimeout(() => {
          onClose();
          if (onSuccessCallback) onSuccessCallback();
        }, 2000);
        
      } catch (error: any) {
        const message = error.response?.data?.detail || "Facial recognition failed or insufficient balance.";
        setErrorMsg(message);
        setIsProcessing(false);
      }
    }, "image/jpeg", 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Receive via Face</h2>
          {!isProcessing && !success && (
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
              <p className="text-slate-500 mt-2">The dashboard will now refresh.</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Amount (₹)</label>
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="text-lg py-6 font-semibold"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Remark / Note</label>
                <Input 
                  type="text" 
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="e.g. Groceries"
                  className="py-5"
                />
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg mt-4" 
                onClick={handleNextStep}
              >
                Proceed to Scan Face
              </Button>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              {errorMsg && (
                <div className="w-full bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-200 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{errorMsg}</p>
                </div>
              )}
              
              <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-100 shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/50 rounded-full m-8 animate-pulse" />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center text-white">
                      <Loader2 className="w-10 h-10 animate-spin mb-3" />
                      <p className="font-semibold">Processing Payment...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    stopCamera();
                    setErrorMsg(null);
                    setStep(1);
                  }}
                  disabled={isProcessing}
                >
                  Edit Amount
                </Button>
                <Button 
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  onClick={captureAndCharge}
                  disabled={isProcessing}
                >
                  <Camera className="w-4 h-4" />
                  Capture & Charge
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
