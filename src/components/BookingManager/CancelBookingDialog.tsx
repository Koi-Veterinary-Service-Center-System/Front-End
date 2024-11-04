import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (refundPercent: string, cancelReason: string) => void;
}

const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [refundPercent, setRefundPercent] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = () => {
    onConfirm(refundPercent, cancelReason);
    setRefundPercent("");
    setCancelReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="refundPercent">Refund Percentage</Label>
            <Select onValueChange={setRefundPercent} value={refundPercent}>
              <SelectTrigger id="refundPercent">
                <SelectValue placeholder="Select refund percentage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cancelReason">Reason for Cancellation</Label>
            <Input
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Cancellation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;
