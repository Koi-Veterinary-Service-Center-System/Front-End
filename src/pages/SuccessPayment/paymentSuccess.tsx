import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, FishIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

export default function PaymentSuccessful() {
  const { bookingID } = useParams();

  // Debugging: log bookingID to ensure it’s being read correctly
  console.log("Booking ID from URL:", bookingID);

  const bookingDetails = {
    service: "An Check-up",
    date: "April 21, 2024",
    time: "2:30 PM",
    petName: "Goldie",
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  // Conditionally render based on the presence of bookingID
  return bookingID ? (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-green-600"
              >
                <motion.path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  variants={checkmarkVariants}
                />
                <motion.path
                  d="M22 4L12 14.01l-3-3"
                  variants={checkmarkVariants}
                />
              </svg>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-green-600">
                Payment Successful!
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="text-center">
            <motion.p className="text-lg mb-6" variants={itemVariants}>
              Thank you for booking with Koi Veterinary Services
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Link to="/">Return to Home</Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  ) : (
    <p>Error: Booking ID not found</p>
  );
}
