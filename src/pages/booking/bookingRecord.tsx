import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFish, FaMoneyBillWave } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/configs/axios"; // Ensure you have axios properly configured

interface KoiVetBookingProps {
  bookingID: string; // Nhận bookingID từ component cha
  serviceFee?: number; // Có thể có hoặc không
  note?: string; // Có thể có hoặc không
  onClose: () => void; // Callback để đóng Dialog sau khi hoàn thành form
}

export default function BookingRecord({
  bookingID,
  serviceFee: initialServiceFee,
  note: initialNote = "",
  onClose, // Nhận prop onClose để đóng Dialog
}: KoiVetBookingProps) {
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentBookingID, setCurrentBookingID] = useState(bookingID); // Gán bookingID từ props
  const [serviceFee, setServiceFee] = useState<number | undefined>(
    initialServiceFee
  ); // State để quản lý serviceFee
  const [note, setNote] = useState<string>(initialNote); // State để quản lý note

  useEffect(() => {
    // Mỗi khi bookingID thay đổi, cập nhật state
    setCurrentBookingID(bookingID);
  }, [bookingID]);

  const handleCompleteBooking = async () => {
    if (!currentBookingID || serviceFee === undefined || serviceFee <= 0) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        "/bookingRecord/create-bookingRecord/auto-completed-booking",
        {
          bookingID: currentBookingID,
          arisedMoney: serviceFee,
          note: note,
        }
      );
      console.log("Booking completed successfully:", response.data);

      // Sau khi thành công, gọi onClose để đóng Dialog
      onClose();
    } catch (error: any) {
      setError(error.response ? error.response.data : "An error occurred");
      console.error("Failed to complete booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Card className="w-full max-w-md overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="water-effect"></div>
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl font-bold text-center text-blue-600">
          Koi Vet Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <motion.div variants={itemVariants}>
          <Label
            htmlFor="bookingID"
            className="flex items-center space-x-2 text-lg mb-2 text-blue-700"
          >
            <FaFish className="text-blue-500" />
            <span>Booking ID</span>
          </Label>
          <Input
            id="bookingID"
            value={currentBookingID}
            readOnly
            className="text-lg bg-white bg-opacity-70"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label
            htmlFor="serviceFee"
            className="flex items-center space-x-2 text-lg mb-2 text-blue-700"
          >
            <FaMoneyBillWave className="text-green-500" />
            <span>Service Fee</span>
          </Label>
          <Input
            id="serviceFee"
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(Number(e.target.value))} // Cập nhật giá trị serviceFee
            placeholder="Enter service fee"
            className="text-lg bg-white bg-opacity-70"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label
            htmlFor="note"
            className="flex items-center space-x-2 text-lg mb-2 text-blue-700"
          >
            <MdNoteAlt className="text-yellow-500" />
            <span>Vet Notes</span>
          </Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)} // Cập nhật giá trị note
            placeholder="Enter notes"
            className="text-lg min-h-[100px] bg-white bg-opacity-70"
          />
        </motion.div>

        {error && (
          <motion.div className="text-red-500" variants={itemVariants}>
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Button
            onClick={handleCompleteBooking}
            className="bg-blue-500 text-white w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Complete Booking"}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
