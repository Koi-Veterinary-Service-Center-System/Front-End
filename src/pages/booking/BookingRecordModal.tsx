import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, DollarSign, FileText, X } from "lucide-react";
import api from "@/configs/axios";

interface BookingRecord {
  arisedQuantity: number;
  quantityMoney: number;
  receivableAmount: number;
  totalAmount: number;
  note: string;
}

interface BookingRecordModalProps {
  bookingID: number;
  isOpen: boolean;
  onClose: () => void;
}

const BookingRecordModal: React.FC<BookingRecordModalProps> = ({
  bookingID,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [bookingRecord, setBookingRecord] = useState<BookingRecord | null>(
    null
  );

  useEffect(() => {
    if (isOpen && bookingID) {
      fetchBookingRecord();
    }
  }, [isOpen, bookingID]);

  const fetchBookingRecord = async () => {
    setLoading(true);
    try {
      const response = await api.get<BookingRecord>(
        `/bookingRecord/${bookingID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookingRecord(response.data);
    } catch (error) {
      console.error("Failed to fetch booking record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md overflow-hidden bg-gradient-to-br from-blue-100 to-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-800">
                  Booking Record Details
                </DialogTitle>
              </DialogHeader>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {bookingRecord ? (
                    <>
                      <motion.div
                        className="flex items-center space-x-3 text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Calendar className="h-5 w-5" />
                        <span>
                          <strong>Arised Quantity:</strong>{" "}
                          {bookingRecord.arisedQuantity}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-3 text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <DollarSign className="h-5 w-5" />
                        <span>
                          <strong>Quantity Money:</strong>{" "}
                          {bookingRecord.quantityMoney.toLocaleString()} VND
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-3 text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <DollarSign className="h-5 w-5" />
                        <span>
                          <strong>Receivable Amount:</strong>{" "}
                          {bookingRecord.receivableAmount.toLocaleString()} VND
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-3 text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <DollarSign className="h-5 w-5" />
                        <span>
                          <strong>Total Amount:</strong>{" "}
                          {bookingRecord.totalAmount.toLocaleString()} VND
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-3 text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FileText className="h-5 w-5" />
                        <span>
                          <strong>Note:</strong> {bookingRecord.note || "N/A"}
                        </span>
                      </motion.div>
                    </>
                  ) : (
                    <p className="text-blue-700">
                      No booking record details available.
                    </p>
                  )}
                </div>
              )}
              <DialogFooter className="mt-6">
                <Button
                  onClick={onClose}
                  className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 ease-in-out"
                >
                  <X className="mr-2 h-4 w-4" /> Close
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default BookingRecordModal;
