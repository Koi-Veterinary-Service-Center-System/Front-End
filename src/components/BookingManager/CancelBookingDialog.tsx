import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  AlertTriangle,
  DollarSign,
  XCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"; // Import Loader2 cho trạng thái loading

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (refundPercent: string, cancelReason: string) => void;
  isLoading: boolean; // Thêm prop isLoading
}

export default function CancelBookingDialog({
  open,
  onClose,
  onConfirm,
  isLoading, // Nhận prop isLoading
  paymentType,
}: CancelBookingDialogProps) {
  const [refundPercent, setRefundPercent] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = () => {
    onConfirm(refundPercent, cancelReason);
    setRefundPercent("");
    setCancelReason("");
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-red-50 to-orange-50">
            <DialogHeader>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <DialogTitle className="text-2xl font-bold text-red-600 flex items-center">
                  <AlertTriangle className="w-8 h-8 mr-2 text-red-500" />
                  Cancel Booking
                </DialogTitle>
              </motion.div>
            </DialogHeader>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {paymentType !== "In Cash" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="refundPercent"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Refund Percentage
                  </Label>
                  <Select
                    onValueChange={setRefundPercent}
                    value={refundPercent}
                  >
                    <SelectTrigger id="refundPercent" className="w-full">
                      <SelectValue placeholder="Select refund percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <SelectItem key={percent} value={percent.toString()}>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            {percent}%
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="cancelReason"
                  className="text-lg font-semibold text-gray-700"
                >
                  Reason for Cancellation
                </Label>
                <Input
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation"
                  className="w-full"
                />
              </div>
            </motion.div>
            <DialogFooter className="mt-6">
              <motion.div
                className="flex justify-end space-x-4 w-full"
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex items-center"
                  disabled={isLoading} // Vô hiệu hóa khi đang loading
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                  disabled={isLoading} // Vô hiệu hóa khi đang loading
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> // Hiển thị spinner khi loading
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Cancelling..." : "Confirm Cancellation"}
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
