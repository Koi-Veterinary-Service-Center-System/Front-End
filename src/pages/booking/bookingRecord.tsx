import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFish, FaMoneyBillWave } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/configs/axios";

interface KoiVetBookingProps {
  bookingID: string;
  arisedQuantity?: number;
  note?: string;
  onClose: () => void;
}

// Define Zod schema for validation
const bookingSchema = z.object({
  arisedQuantity: z
    .number({ required_error: "Arised quantity is required" })
    .min(1, "Arised quantity must be at least 1"),
  note: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingRecord({
  bookingID,
  arisedQuantity: initialArisedQuantity,
  note: initialNote = "",
  onClose,
}: KoiVetBookingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBookingID, setCurrentBookingID] = useState(bookingID);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      arisedQuantity: initialArisedQuantity,
      note: initialNote,
    },
  });

  useEffect(() => {
    setCurrentBookingID(bookingID);
  }, [bookingID]);

  const handleCompleteBooking = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        "/bookingRecord/create-bookingRecord/auto-completed-booking",
        {
          bookingID: currentBookingID,
          arisedQuantity: data.arisedQuantity,
          note: data.note,
        }
      );
      console.log("Booking completed successfully:", response.data);
      onClose();
    } catch (error: any) {
      setError(error.response ? error.response.data : "An error occurred");
      console.error("Failed to complete booking:", error);
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={form.handleSubmit(handleCompleteBooking)}>
          <motion.div variants={itemVariants}>
            <Label
              htmlFor="arisedQuantity"
              className="flex items-center space-x-2 text-lg mb-2 text-blue-700"
            >
              <FaMoneyBillWave className="text-green-500" />
              <span>Arised Quantity</span>
            </Label>
            <Input
              id="arisedQuantity"
              type="number"
              {...form.register("arisedQuantity", { valueAsNumber: true })}
              placeholder="Enter arised quantity"
              className="text-lg bg-white bg-opacity-70"
            />
            <p className="text-red-500 mt-1">
              {form.formState.errors.arisedQuantity?.message}
            </p>
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
              {...form.register("note")}
              placeholder="Enter notes"
              className="text-lg min-h-[100px] bg-white bg-opacity-70"
            />
            <p className="text-red-500 mt-1">
              {form.formState.errors.note?.message}
            </p>
          </motion.div>

          {error && (
            <motion.div className="text-red-500" variants={itemVariants}>
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="bg-blue-500 text-white w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Booking"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
