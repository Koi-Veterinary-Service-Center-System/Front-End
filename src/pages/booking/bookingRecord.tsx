import { motion } from "framer-motion";
import { FaFish, FaMoneyBillWave } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KoiVetBookingProps {
  bookingID: string;
  serviceFee: number;
  koiType: string;
  note: string;
}

const KoiSVG = () => (
  <svg
    className="w-24 h-24 mx-auto mb-4"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z"
      fill="#C8EEF9"
    />
    <path
      d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z"
      fill="white"
    />
    <circle cx="40" cy="40" r="5" fill="black" />
    <path
      d="M60 70C60 70 70 60 70 50C70 40 60 30 60 30"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);

export default function KoiVetBooking({
  bookingID = "KOI001",
  serviceFee = 150,
  koiType = "Kohaku",
  note = "Regular check-up for Koi",
}: KoiVetBookingProps) {
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
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="water-effect"></div>
        </div>
        <CardHeader className="relative z-10">
          <KoiSVG />
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
              value={bookingID}
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
              readOnly
              className="text-lg bg-white bg-opacity-70"
              prefix="$"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label
              htmlFor="koiType"
              className="flex items-center space-x-2 text-lg mb-2 text-blue-700"
            >
              <FaFish className="text-blue-500" />
              <span>Koi Type</span>
            </Label>
            <Select defaultValue={koiType}>
              <SelectTrigger className="bg-white bg-opacity-70">
                <SelectValue placeholder="Select Koi Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kohaku">Kohaku</SelectItem>
                <SelectItem value="Sanke">Sanke</SelectItem>
                <SelectItem value="Showa">Showa</SelectItem>
                <SelectItem value="Butterfly">Butterfly Koi</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
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
              readOnly
              className="text-lg min-h-[100px] bg-white bg-opacity-70"
            />
          </motion.div>
        </CardContent>
      </Card>
      <style jsx global>{`
        .water-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 75%,
            transparent
          );
          background-size: 100px 100px;
          animation: water 10s linear infinite;
          transform: rotate(45deg);
        }
        @keyframes water {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100px 100px;
          }
        }
      `}</style>
    </motion.div>
  );
}
