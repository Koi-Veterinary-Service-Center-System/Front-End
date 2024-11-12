import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";

const XCircleSVG = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M15 9L9 15"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
    />
    <motion.path
      d="M9 9L15 15"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
    />
  </svg>
);

export default function PaymentFailed() {
  const [isHovering, setIsHovering] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
              animate={{ rotate: isHovering ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <XCircleSVG />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p className="text-lg mb-6" variants={itemVariants}>
                We're sorry, but there was an issue processing your payment for
                Koi Veterinary Services
              </motion.p>
              <motion.p
                className="text-sm text-gray-600 mb-4"
                variants={itemVariants}
              >
                Your booking is not confirmed. Please try again or contact our
                support team for assistance.
              </motion.p>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                <Link to="/booking">Try Again</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center"
              >
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
