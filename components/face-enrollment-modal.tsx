"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, UploadCloud, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { faceService } from "@/lib/api/services";

interface FaceEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaceEnrollmentModal({ isOpen, onClose }: FaceEnrollmentModalProps) {
  const { toast } = useToast();
  
  // Step 1: Check Status, Step 2: Upload Files
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Array of 5 files maximum
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);

  const ALERTS = [
    "Straight / Front — Look directly at the camera, neutral expression.",
    "Slight Left — Turn your head about 15° to the left.",
    "Slight Right — Turn your head about 15° to the right.",
    "Chin slightly down — Tilt your head downward about 10–15°.",
    "Chin slightly up — Tilt your head upward about 10–15°."
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFiles([null, null, null, null, null]);
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const status = await faceService.checkFaceStatus();
      setIsEnrolled(status.enrolled);
    } catch (error) {
      console.error("Status check failed", error);
      toast({
        title: "Error fetching status",
        description: "Could not retrieve face enrollment status.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...files];
    updated[index] = file;
    setFiles(updated);
  };

  const handleSubmit = async () => {
    const validFiles = files.filter(f => f !== null) as File[];
    if (validFiles.length < 5) {
      toast({
        title: "Missing Files",
        description: "Please upload all 5 required angles.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEnrolled) {
        await faceService.reenrollFace(validFiles);
      } else {
        await faceService.enrollFace(validFiles);
      }
      
      toast({
        title: "Success",
        description: "Face enrollment completed successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Enrollment Failed",
        description: error.response?.data?.detail || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Face Enrollment</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6">
              {isLoadingStatus ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                  <p>Checking status...</p>
                </div>
              ) : (
                <>
                  <div className="text-center p-6 bg-slate-50 rounded-xl">
                    {isEnrolled ? (
                      <div>
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-lg text-slate-800">You are already enrolled</h3>
                      </div>
                    ) : (
                      <h3 className="font-semibold text-lg text-slate-800">Enroll your face for quick access</h3>
                    )}
                  </div>

                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 space-y-3 font-medium text-sm">
                    <div className="flex items-center gap-2 font-bold mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Prepare your environment first:
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 font-normal">
                      <li>Find a well-lit area — natural light or a lamp facing you works best.</li>
                      <li>Avoid sitting with a bright window or light behind you (backlighting confuses detection).</li>
                      <li>Remove glasses, hat, or anything covering your face.</li>
                      <li>Keep your face fully visible — no hair across the face.</li>
                    </ul>
                    
                    <div className="font-bold pt-2 text-blue-900">Important notes:</div>
                    <p className="text-slate-700 font-normal">
                      Stay within 30–60 cm from the camera. Keep your face centered. Hold still — blurry images reduce accuracy. Each photo is processed through a liveness check, so a printed photo or screen image will be rejected.
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg" 
                    onClick={() => setStep(2)}
                  >
                    {isEnrolled ? "Re-enroll Face" : "Start Enrollment"}
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-2">Upload one photo for each exact angle required:</p>
              
              <div className="space-y-3">
                {ALERTS.map((title, idx) => (
                  <div key={idx} className="border rounded-xl p-3 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-700 mb-2">{title}</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="file" 
                        accept="image/*"
                        className="file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 text-sm flex-1 bg-white cursor-pointer"
                        onChange={(e) => handleFileChange(idx, e.target.files?.[0] || null)}
                      />
                      {files[idx] && <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</>
                  ) : (
                    <><UploadCloud className="w-4 h-4 mr-2" /> Upload & Enroll</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}