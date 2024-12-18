import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios";
import { Booking, Prescription, Profile } from "../../types/info";
import {
  Moon,
  Sun,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircle2,
  Loader2,
  Activity,
  Stethoscope,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Aperture,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VscNotebook } from "react-icons/vsc";
import { HiOutlineMail } from "react-icons/hi";
import { BsCashCoin, BsCreditCard2Back } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import { SiGooglemeet } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import SlidebarProfile from "@/components/Sidebar/SlidebarProfile";
import { ViewPrescriptionDialog } from "../Detail Appointment Page/ViewPrescriptionDialog";
import axios from "axios";
import BookingRecordModal from "./BookingRecordModal";
const statusSteps = [
  {
    label: "Pending",
    icon: <Loader2 className="h-4 w-4" />,
    color: "bg-yellow-400",
  },
  {
    label: "Scheduled",
    icon: <CalendarIcon className="h-4 w-4" />,
    color: "bg-blue-400",
  },
  {
    label: "Ongoing",
    icon: <Activity className="h-4 w-4" />,
    color: "bg-purple-400",
  },
  {
    label: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-400",
  },
  {
    label: "Received_Money",
    icon: <TbMoneybag className="h-4 w-4" />,
    color: "bg-green-200",
  },
];

const StatusComponent = ({ currentStatus }: { currentStatus?: string }) => {
  const currentIndex = statusSteps.findIndex(
    (step) => step.label === currentStatus
  );

  const progressPercentage = (currentIndex / (statusSteps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute top-5 w-full h-1 bg-gray-200"></div>
        <motion.div
          className="absolute top-5 h-1 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.label} className="text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 ${
                  index <= currentIndex
                    ? step.color
                    : "bg-white border-gray-300"
                }`}
              >
                {step.label === "Pending" && index <= currentIndex ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    {step.icon}
                  </motion.div>
                ) : (
                  step.icon
                )}
              </div>
              <div className="mt-2 text-xs font-medium">{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailBooking = () => {
  const { bookingID } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isPrescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const backgroundStyle = {
    backgroundImage:
      "url('https://firebasestorage.googleapis.com/v0/b/swp391veterinary.appspot.com/o/subtle-prism.png?alt=media&token=e88974a9-6dcf-49dd-83ec-cefe66c48f23')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };
  const [isBookingRecordModalOpen, setBookingRecordModalOpen] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState<string | null>(
    null
  );

  const handleOpenBookingRecordModal = (bookingID: string) => {
    setSelectedBookingID(bookingID);
    setBookingRecordModalOpen(true);
  };

  const handleCloseBookingRecordModal = () => {
    setSelectedBookingID(null);
    setBookingRecordModalOpen(false);
  };

  // Fetch all booking and calculate totals
  // Fetch all booking and calculate totals based on the user's role
  const fetchBooking = async () => {
    try {
      // Gọi API mới với bookingID từ useParams
      const response = await api.get(`/booking/view-booking/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fetchedBookings = response.data;
      console.log("Fetched Bookings:", fetchedBookings);
      setBookings([fetchedBookings]); // Cập nhật bookings
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch bookings.";

      if (axios.isAxiosError(error) && error.response) {
        // Axios-specific error handling
        errorMessage = error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        // Other error types, such as network errors
        errorMessage = error.message;
      }

      console.error(errorMessage);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const response = await api.get("User/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile fetched:", response.data);
      setProfile(response.data);
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch bookings.";

      if (axios.isAxiosError(error) && error.response) {
        // Axios-specific error handling
        errorMessage = error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        // Other error types, such as network errors
        errorMessage = error.message;
      }

      console.error("Fetch error:", error);
      toast.error(errorMessage);
    }
  };
  const fetchPrescriptionRecord = async (bookingID: Booking) => {
    try {
      const response = await api.get(`/pres-rec/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Sort prescriptions by ID in descending order (newest first)
      const sortedPrescriptions = response.data.sort(
        (a: Prescription, b: Prescription) =>
          (b.prescriptionRecordID || 0) - (a.prescriptionRecordID || 0)
      );
      setSelectedPrescription(sortedPrescriptions || []);
      // Store all prescription data
      setPrescriptionDialogOpen(true); // Open dialog
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch bookings.";

      if (axios.isAxiosError(error) && error.response) {
        // Axios-specific error handling
        errorMessage = error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        // Other error types, such as network errors
        errorMessage = error.message;
      }

      console.error("Fetch error:", error);
      toast.error(errorMessage);
    }
  };
  // Call fetchBooking in useEffect
  // Fetch Profile once on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchBooking();
  }, [bookingID]); // Gọi lại fetchBooking khi id thay đổi

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "received_money":
        return "bg-green-400 text-green-900";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
        <SlidebarProfile />

        <main className="flex-1" style={backgroundStyle}>
          <header className="bg-gradient-to-br from-blue-50 to-blue-400 dark:from-gray-800 dark:to-gray-900 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleDarkModeSwitch}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Avatar>
                  <AvatarImage
                    src={profile?.imageURL}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 m-5">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <motion.div
                  key={booking.bookingID}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden col-span-full bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg">
                    {!["Succeeded", "Cancelled"].includes(
                      booking.bookingStatus
                    ) && (
                      <StatusComponent currentStatus={booking.bookingStatus} />
                    )}
                    <CardHeader className="pb-4 bg-blue-500 text-white">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center">
                          <Stethoscope className="mr-2 h-6 w-6" />
                          {booking.serviceName}
                        </CardTitle>
                        <Badge
                          className={`${getStatusColor(
                            booking.bookingStatus
                          )} text-sm font-semibold px-3 py-1 rounded-full`}
                        >
                          {booking.bookingStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center mb-4">
                            <Avatar className="h-16 w-16 mr-4 border-2 border-blue-500">
                              <AvatarImage
                                src={booking.imageURL}
                                alt={booking.vetName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-500 text-xl font-bold">
                                {booking.vetName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-lg text-blue-700">
                                {booking.vetName}
                              </p>
                              <p className="text-sm text-blue-500 flex items-center">
                                <HiOutlineMail className="mr-1" />
                                {booking.vetEmail}
                              </p>
                              <p className="text-sm text-blue-500">
                                Veterinarian
                              </p>
                            </div>
                          </div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.9 }}
                          >
                            <Stethoscope className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              Service at Booking: {booking.serviceNameAtBooking}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                          >
                            <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              {booking.bookingDate}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                          >
                            <ClockIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              {booking.slotWeekDateAtBooking}{" "}
                              {booking.slotStartTimeAtBooking} -{" "}
                              {booking.slotEndTimeAtBooking}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                          >
                            <MapPinIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              {booking.location ===
                              "undefined, undefined, undefined"
                                ? "No location"
                                : booking.location}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                          >
                            <Aperture className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              Quantity: {booking.quantity}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                          >
                            {booking.paymentTypeAtBooking === "VNPay" &&
                            booking.meetURL ? (
                              <>
                                <SiGooglemeet className="h-5 w-5 mr-3 text-blue-500" />
                                <a
                                  href={booking.meetURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Join Meeting
                                </a>
                              </>
                            ) : (
                              <span className="text-gray-700">
                                No meeting URL
                              </span>
                            )}
                          </motion.div>
                        </div>
                        <div className="space-y-4">
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                          >
                            <VscNotebook className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              {
                                [
                                  "Succeed",
                                  "Cancelled",
                                  "Completed",
                                  "Received_Money",
                                ].includes(booking.bookingStatus)
                                  ? booking.bookingRecordNote ||
                                    "No notes available" // Nếu bookingRecordNote là null hoặc rỗng
                                  : booking.note || "No notes available" // Nếu note là null hoặc rỗng
                              }
                            </span>
                          </motion.div>

                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.6 }}
                          >
                            <DollarSign className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700">
                              Payment Status:{" "}
                              {booking.isPaid ? (
                                <CheckCircle className="inline h-5 w-5 text-green-500 ml-2" />
                              ) : (
                                <XCircle className="inline h-5 w-5 text-red-500 ml-2" />
                              )}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.7 }}
                          >
                            <div className="flex-shrink-0">
                              <FileText className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Prescription
                              </h3>
                              <div className="mt-2">
                                {booking.hasPres ? (
                                  <Badge className="text-sm">
                                    <CheckCircle className="inline-block h-4 w-4 mr-1" />
                                    Available
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="destructive"
                                    className="text-sm"
                                  >
                                    <XCircle className="inline-block h-4 w-4 mr-1" />
                                    Not Available
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {/* Booking details here */}
                            {booking.hasPres && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={() =>
                                  fetchPrescriptionRecord(booking.bookingID)
                                }
                              >
                                View Prescription
                              </Button>
                            )}
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.7 }}
                          >
                            <div className="flex-shrink-0">
                              <FileText className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Booking Record
                              </h3>
                              <div className="mt-2">
                                {booking.hasBookingRecord ? (
                                  <Badge className="text-sm">
                                    <CheckCircle className="inline-block h-4 w-4 mr-1" />
                                    Available
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="destructive"
                                    className="text-sm"
                                  >
                                    <XCircle className="inline-block h-4 w-4 mr-1" />
                                    Not Available
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {/* Booking details here */}
                            {booking.hasBookingRecord && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={() =>
                                  handleOpenBookingRecordModal(
                                    booking.bookingID
                                  )
                                }
                              >
                                View Booking Record
                              </Button>
                            )}
                          </motion.div>

                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 1.0 }}
                          >
                            {booking.paymentTypeAtBooking === "VNPay" ? (
                              <BsCreditCard2Back className="h-5 w-5 mr-3 text-blue-500" />
                            ) : (
                              <BsCashCoin className="h-5 w-5 mr-3 text-green-500" />
                            )}
                            <span className="text-gray-700">
                              Payment Type: {booking.paymentTypeAtBooking}
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.8 }}
                          >
                            <CreditCardIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700 font-semibold">
                              Initial Amount:{" "}
                              {booking?.initAmount != null
                                ? booking.initAmount.toLocaleString("vi-VN")
                                : "0"}{" "}
                              vnd
                            </span>
                          </motion.div>
                          <motion.div
                            className="flex items-center text-sm"
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.8 }}
                          >
                            <CreditCardIcon className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="text-gray-700 font-semibold">
                              Total:{" "}
                              {booking?.totalAmount != null
                                ? booking.totalAmount.toLocaleString("vi-VN")
                                : "0"}{" "}
                              vnd
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <img
                  src="src/assets/images/The Sad Snowman - Falling Apart.png"
                  alt="No bookings"
                  className="w-32 h-32 mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No bookings found for this status.
                </p>
              </motion.div>
            )}
          </div>
          <ViewPrescriptionDialog
            isOpen={isPrescriptionDialogOpen}
            onClose={() => setPrescriptionDialogOpen(false)}
            prescriptions={selectedPrescription || ""}
          />
          <BookingRecordModal
            bookingID={selectedBookingID || ""} // Đảm bảo giá trị mặc định
            isOpen={isBookingRecordModalOpen}
            onClose={handleCloseBookingRecordModal}
          />
        </main>
      </div>
    </div>
  );
};

export default DetailBooking;
