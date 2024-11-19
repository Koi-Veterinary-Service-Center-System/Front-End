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
import { Loader2, X } from "lucide-react";
import api from "@/configs/axios";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

interface BookingRecord {
  initAmount: number;
  arisedQuantity: number;
  initQuantity: number;
  quantityMoney: number;
  receivableAmount: number;
  totalAmount: number;
  note: string;
  createAt: string;
  unitPrice: number;
}

interface BookingRecordModalProps {
  bookingID?: string | null;
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
    if (!bookingID) return;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(date).toLocaleDateString("vi-VN", options);
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
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span>Initial Quantity:</span>
                        <span className="text-right">
                          {bookingRecord.initQuantity}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span>Arised Quantity:</span>
                        <span className="text-right">
                          {bookingRecord.arisedQuantity}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span>Price Per Quantity:</span>
                        <span className="text-right">
                          {formatCurrency(bookingRecord.unitPrice)}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {/* Left-aligned content */}
                        <div className="flex items-center space-x-2">
                          <MdOutlineArrowRightAlt className="h-5 w-5 text-blue-700" />
                          <span>Total Quantity Money:</span>
                        </div>

                        {/* Right-aligned content */}
                        <span className="text-right">
                          {formatCurrency(bookingRecord.quantityMoney)}
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-2">
                          <FiPlus className="h-5 w-5 text-blue-700" />
                          <span>Initial Amount:</span>
                        </div>
                        <span className="text-right">
                          {formatCurrency(bookingRecord.initAmount)}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center space-x-2">
                          <MdOutlineArrowRightAlt className="h-5 w-5 text-blue-700" />
                          <span>Total Amount:</span>
                        </div>
                        <span className="text-right">
                          {formatCurrency(bookingRecord.totalAmount)}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700 font-bold text-lg bg-blue-100 rounded-lg p-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span>Receivable Money:</span>
                        <span className="text-right text-blue-900">
                          {formatCurrency(bookingRecord.receivableAmount)}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <span>Note:</span>
                        <span className="text-right">
                          {bookingRecord.note || "N/A"}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center text-blue-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <span>Created At:</span>
                        <span className="text-right">
                          {formatDate(bookingRecord.createAt)}
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
