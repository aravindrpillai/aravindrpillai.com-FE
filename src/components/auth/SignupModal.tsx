import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SignupData {
  penName: string;
  accessCode: string;
  requireSMS: boolean;
  mobileNumber?: string;
  sampleMessage?: string;
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (data: SignupData) => void;
}

export const SignupModal = ({ isOpen, onClose, onSignup }: SignupModalProps) => {
  const [penName, setPenName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [requireSMS, setRequireSMS] = useState("no");
  const [mobileNumber, setMobileNumber] = useState("");
  const [sampleMessage, setSampleMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAccessCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    setAccessCode(cleanValue);
  };

  const handleMobileNumberChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(cleanValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!penName.trim()) {
      newErrors.penName = "Pen name is required";
    }

    if (accessCode.length !== 4) {
      newErrors.accessCode = "Access code must be 4 digits";
    }

    if (requireSMS === "yes") {
      if (!mobileNumber || mobileNumber.length !== 10) {
        newErrors.mobileNumber = "Mobile number must be 10 digits";
      }
      if (!sampleMessage.trim()) {
        newErrors.sampleMessage = "Sample message is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSignup({
        penName: penName.trim(),
        accessCode,
        requireSMS: requireSMS === "yes",
        mobileNumber: requireSMS === "yes" ? mobileNumber : undefined,
        sampleMessage: requireSMS === "yes" ? sampleMessage.trim() : undefined,
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setPenName("");
    setAccessCode("");
    setRequireSMS("no");
    setMobileNumber("");
    setSampleMessage("");
    setErrors({});
  };

  const formatAccessCode = (code: string) => {
    const chars = code.split('');
    const formatted = [];
    for (let i = 0; i < 4; i++) {
      formatted.push(chars[i] || '_');
    }
    return formatted.join(' - ');
  };

  const isFormValid = penName.trim() && accessCode.length === 4 && 
    (requireSMS === "no" || (mobileNumber.length === 10 && sampleMessage.trim()));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-penname">Pen Name</Label>
            <Input
              id="signup-penname"
              type="text"
              placeholder="Enter your pen name"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              className={errors.penName ? "border-destructive" : ""}
            />
            {errors.penName && (
              <p className="text-sm text-destructive">{errors.penName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-accesscode">Access Code</Label>
            <Input
              id="signup-accesscode"
              type="text"
              placeholder="Enter 4-digit code"
              value={accessCode}
              onChange={(e) => handleAccessCodeChange(e.target.value)}
              maxLength={4}
              className={errors.accessCode ? "border-destructive" : ""}
            />
            <div className="text-center text-sm text-muted-foreground font-mono tracking-widest">
              {formatAccessCode(accessCode)}
            </div>
            {errors.accessCode && (
              <p className="text-sm text-destructive">{errors.accessCode}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>SMS Notifications</Label>
            <RadioGroup 
              value={requireSMS} 
              onValueChange={setRequireSMS}
              className="flex flex-row gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sms-no" />
                <Label htmlFor="sms-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sms-yes" />
                <Label htmlFor="sms-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {requireSMS === "yes" && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input
                  id="mobile-number"
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => handleMobileNumberChange(e.target.value)}
                  maxLength={10}
                  className={errors.mobileNumber ? "border-destructive" : ""}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-destructive">{errors.mobileNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-message">Sample Message</Label>
                <Textarea
                  id="sample-message"
                  placeholder="Enter a sample notification message"
                  value={sampleMessage}
                  onChange={(e) => setSampleMessage(e.target.value)}
                  rows={3}
                  className={errors.sampleMessage ? "border-destructive" : ""}
                />
                {errors.sampleMessage && (
                  <p className="text-sm text-destructive">{errors.sampleMessage}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};