"use client";

import { useState } from "react";
import { X, UserRound, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/lib/api/services";

interface UpdateIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateIdModal({ isOpen, onClose }: UpdateIdModalProps) {
  const { toast } = useToast();
  
  // true = Name, false = Mobile Number
  const [useName, setUseName] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await userService.updateRadixId({ name_in_id: useName });
      
      toast({
        title: "Radix ID Updated",
        description: "Please log in again to sync your new ID.",
      });
      
      // Clear token and redirect to force re-auth
      localStorage.removeItem("access_token");
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Error updating ID",
        description: error.response?.data?.detail || "Something went wrong.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Change Radix ID Format</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200" disabled={isSubmitting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="text-center mb-2">
            <p className="text-slate-500 text-sm">
              Do you want your unique Radix ID to be generated using your Name or Mobile Number?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setUseName(true)}
              className={\cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all \\}
            >
              <div className={\p-3 rounded-full \\}>
                <UserRound className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h4 className={\ont-bold \\}>Use Name</h4>
                <p className="text-[10px] text-slate-500 mt-1">e.g. john.doe</p>
              </div>
            </div>

            <div 
              onClick={() => setUseName(false)}
              className={\cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all \\}
            >
              <div className={\p-3 rounded-full \\}>
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h4 className={\ont-bold \\}>Use Number</h4>
                <p className="text-[10px] text-slate-500 mt-1">e.g. 08012345678</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs border border-amber-200">
            <strong>Note:</strong> Applying this change will log you out, and you must log in again to sync your new Radix ID in the App.
          </div>

          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating ID...</>
            ) : "Confirm & Log Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
