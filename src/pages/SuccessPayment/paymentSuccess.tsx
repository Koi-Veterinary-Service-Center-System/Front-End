import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, FishIcon, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { SiProcesswire } from "react-icons/si";

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
              Thank you for booking with KoiNe Services
            </motion.p>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4">
            <div className="w-full">
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                    size="sm"
                  >
                    <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <Link href="/" className="flex items-center text-sm">
                      Return to Home
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    className="w-full h-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                    size="sm"
                  >
                    <SiProcesswire className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    <Link href="/process" className="flex items-center text-sm">
                      Return to Booking
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  ) : (
    <p>Error: Booking ID not found</p>
  );
}
