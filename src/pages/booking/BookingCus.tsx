import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios";
import { Booking, Profile } from "../../types/info";
import {
  Users,
  DollarSign,
  Moon,
  Sun,
  AlertCircle,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  BriefcaseMedical,
} from "lucide-react";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiCheckboxChecked } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SlidebarProfile from "@/components/Sidebar/SlidebarProfile";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { differenceInDays } from "date-fns";
import ConfirmStatusChangeModal from "./ConfirmStatusChangeModal";
import { AxiosError } from "axios";

const statusOptions = [
  "Scheduled",
  "Ongoing",
  "Completed",
  "Received_Money",
  "Succeeded",
  "Cancelled",
] as const;
type Status = (typeof statusOptions)[number]; // Create a type from statusOptions array

// Hàm kiểm tra và tự động cập nhật trạng thái các đặt chỗ quá hạn

// Map each status to an icon component
const statusIcons: Record<Status, React.ElementType> = {
  Scheduled: AiOutlineSchedule,
  Ongoing: Users,
  Completed: BiCheckboxChecked,
  Received_Money: FaRegMoneyBillAlt,
  Succeeded: DollarSign,
  Cancelled: AlertCircle,
};

const BookingCus = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const backgroundStyle = {
    backgroundImage:
      "url('https://firebasestorage.googleapis.com/v0/b/swp391veterinary.appspot.com/o/subtle-prism.png?alt=media&token=e88974a9-6dcf-49dd-83ec-cefe66c48f23')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };
  const [activeStatus, setActiveStatus] = useState<Status>("Scheduled");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cancelBookingInfo, setCancelBookingInfo] = useState({
    bankName: "",
    customerBankNumber: "",
    customerBankAccountName: "",
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // Fetch all booking and calculate totals
  // Fetch bookings based on active status
  const fetchBookingsByStatus = async (status: Status) => {
    const apiUrl =
      status === "Succeeded" || status === "Cancelled"
        ? `/booking/view-booking-history`
        : `/booking/view-booking-process`;

    try {
      const response = await api.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { status }, // Filter bookings by status
      });

      // Lấy dữ liệu và sắp xếp theo bookingID (mới nhất lên đầu)
      const fetchedBookings = response.data.sort((a: Booking, b: Booking) => {
        const idA = Number(a.bookingID); // Chuyển đổi sang số
        const idB = Number(b.bookingID); // Chuyển đổi sang số
        return idB - idA; // Sắp xếp giảm dần
      });
      setBookings(fetchedBookings); // Cập nhật state bookings
      console.log(fetchedBookings);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.info(errorMessage);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("User/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.error(errorMessage);
    }
  };

  // Call fetchBooking in useEffect
  useEffect(() => {
    fetchProfile(); // Fetch bookings initially
  }, []); // Re-fetch bookings when the status changes

  // Handle status change and fetch bookings
  const handleStatusClick = (status: Status) => {
    setActiveStatus(status); // Update the active status
    fetchBookingsByStatus(status); // Fetch bookings based on status
  };

  useEffect(() => {
    const fetchAndCheckBookings = async () => {
      await fetchBookingsByStatus(activeStatus); // Lấy danh sách đặt chỗ
      await checkAndAutoUpdateBookings(bookings); // Kiểm tra và tự động cập nhật nếu cần
    }; // Fetch bookings on initial load
    fetchAndCheckBookings();
  }, []); // Runs only once on component mount

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  // Hàm kiểm tra và tự động cập nhật trạng thái đặt chỗ quá 2 ngày sang "Succeeded"
  const checkAndAutoUpdateBookings = async (
    bookings: Booking[]
  ): Promise<void> => {
    const today = new Date();

    for (const booking of bookings) {
      // Kiểm tra nếu trạng thái hiện tại là "Completed"
      if (booking.bookingStatus === "Completed") {
        const bookingDate = new Date(booking.bookingDate); // Sử dụng `bookingDate` để so sánh

        // Nếu đã qua 2 ngày kể từ `bookingDate`
        if (differenceInDays(today, bookingDate) >= 7) {
          await handleUpdateStatus(booking.bookingID, "Succeeded");
        }
      }
    }
  };

  const handleUpdateStatus = async (
    bookingID: string,
    bookingStatus: string
  ) => {
    try {
      // Make a PATCH request to the API endpoint
      const response = await api.patch(`/booking/success/${bookingID}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        toast.success(
          `Booking ${bookingID} status updated to ${bookingStatus}`
        );
        fetchBookingsByStatus(activeStatus); // Refresh bookings to show updated status
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      console.log(errorMessage);
    }
  };

  const openCancelDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };

  // Hàm để cập nhật thông tin Form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCancelBookingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Cập nhật hàm handleCancelBooking
  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    try {
      await api.patch(
        `/booking/cancel-booking/${selectedBookingId}`,
        cancelBookingInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Booking ${selectedBookingId} has been cancelled`);
      setIsCancelDialogOpen(false);
      // Cập nhật trực tiếp trong UI: loại bỏ booking vừa hủy
      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) => booking.bookingID !== selectedBookingId
        )
      ); // Refresh bookings after cancellation
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.warning(errorMessage);
    }
  };

  // Confirm success status handler
  const handleConfirmSuccess = async () => {
    if (!selectedBookingId) return;

    try {
      await api.patch(`/booking/success/${selectedBookingId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(`Booking ${selectedBookingId} status updated to Success`);
      setIsConfirmModalOpen(false);
      // Cập nhật trực tiếp trong UI: đổi trạng thái của booking thành Success
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingID === selectedBookingId
            ? { ...booking, bookingStatus: "Succeeded" }
            : booking
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.error(errorMessage);
    }
  };

  // Open modal to confirm success status
  const openConfirmModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsConfirmModalOpen(true);
  };

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 5000);

    return () => clearInterval(waveInterval);
  }, []);

  const rebookAppointment = (booking: Booking) => {
    navigate("/booking", {
      state: {
        rebookData: booking, // Gửi dữ liệu booking cũ
      },
    });
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

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full max-w-4xl mx-auto mb-8">
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Booking Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {statusOptions.map((status) => {
                      const Icon = statusIcons[status];
                      return (
                        <motion.div
                          key={status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={
                              activeStatus === status ? "default" : "outline"
                            }
                            onClick={() => handleStatusClick(status)}
                            className={`flex items-center gap-2 ${
                              activeStatus === status
                                ? "bg-blue-500 text-white"
                                : "hover:bg-blue-100 hover:text-blue-500"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {status.replace("_", " ")}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Bookings
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Filter bookings by activeStatus before rendering */}
                    {bookings.filter(
                      (booking) => booking.bookingStatus === activeStatus
                    ).length > 0 ? (
                      bookings
                        .filter(
                          (booking) => booking.bookingStatus === activeStatus
                        )
                        .map((booking) => (
                          <motion.div
                            key={booking.bookingID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="mb-4 overflow-hidden border-l-4 border-blue-500">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg text-blue-600">
                                    {booking.serviceNameAtBooking}
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <Link
                                  to={`/detailB/${booking.bookingID}`}
                                  className="block mb-4"
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3">
                                      <AvatarImage
                                        src={booking.imageURL}
                                        alt={booking.vetName}
                                        className="object-cover"
                                      />
                                      <AvatarFallback>
                                        {booking.vetName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-semibold text-blue-600">
                                        {booking.vetName}
                                      </p>
                                      <p className="text-sm text-blue-400">
                                        Veterinarian
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{booking.slotWeekDateAtBooking}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>
                                      {booking.slotStartTimeAtBooking} -{" "}
                                      {booking.slotEndTimeAtBooking}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>
                                      {booking.location ===
                                      "undefined, undefined, undefined"
                                        ? "No Location"
                                        : booking.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCardIcon className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>
                                      {(
                                        booking.initAmount + booking.arisedMoney
                                      ).toLocaleString("vi-VN")}
                                      vnd
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                {/* Feedback Button: Only show when booking status is Succeeded and feedback is not yet provided */}
                                {booking.bookingStatus === "Succeeded" &&
                                !booking.hasFeedback ? (
                                  <Link to={`/feedback/${booking.bookingID}`}>
                                    <motion.div
                                      className="relative"
                                      onHoverStart={() => setIsHovered(true)}
                                      onHoverEnd={() => setIsHovered(false)}
                                    >
                                      <Button
                                        variant="outline"
                                        className="relative overflow-hidden bg-white text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 ease-in-out"
                                      >
                                        <VscFeedback className="mr-2" />
                                        Feedback
                                        <motion.div
                                          className="absolute inset-0 bg-blue-100 z-0"
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{
                                            scale: isHovered ? 1 : 0,
                                            opacity: isHovered ? 0.5 : 0,
                                          }}
                                          transition={{ duration: 0.3 }}
                                        />
                                      </Button>
                                      <motion.div
                                        className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          delay: 0.5,
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 30,
                                        }}
                                      >
                                        <motion.div
                                          className="w-4 h-4 bg-white rounded-full"
                                          animate={{
                                            y: isWaving ? [-2, 2, -2] : 0,
                                          }}
                                          transition={{
                                            duration: 0.3,
                                            repeat: isWaving ? 3 : 0,
                                            repeatType: "reverse",
                                          }}
                                        />
                                      </motion.div>
                                    </motion.div>
                                  </Link>
                                ) : null}

                                {/* Confirm to Success Button: Only show when booking status is Succeeded */}
                                {booking.bookingStatus === "Received_Money" && (
                                  <Button
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                    variant="outline"
                                    onClick={() =>
                                      openConfirmModal(booking.bookingID)
                                    }
                                  >
                                    Confirm to Success
                                  </Button>
                                )}

                                {/* Cancel Booking Button: Only show when booking status is Scheduled */}
                                {booking.bookingStatus === "Scheduled" && (
                                  <Dialog
                                    open={isCancelDialogOpen}
                                    onOpenChange={setIsCancelDialogOpen}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        onClick={() =>
                                          openCancelDialog(booking.bookingID)
                                        }
                                      >
                                        Cancel Booking
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Cancel Booking
                                        </DialogTitle>
                                      </DialogHeader>
                                      <p>
                                        Are you sure you want to cancel this
                                        booking?
                                      </p>

                                      {/* Show bank information form only if payment type is not "In Cash" */}
                                      {booking.paymentTypeAtBooking !==
                                      "In Cash" ? (
                                        <>
                                          <p>
                                            Please provide your bank information
                                            for any refunds.
                                          </p>
                                          <form>
                                            <div className="mb-4">
                                              <label className="block text-gray-700">
                                                Bank Name:
                                              </label>
                                              <input
                                                type="text"
                                                name="bankName"
                                                value={
                                                  cancelBookingInfo.bankName
                                                }
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                                required
                                              />
                                            </div>
                                            <div className="mb-4">
                                              <label className="block text-gray-700">
                                                Bank Account Number:
                                              </label>
                                              <input
                                                type="text"
                                                name="customerBankNumber"
                                                value={
                                                  cancelBookingInfo.customerBankNumber
                                                }
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                                required
                                              />
                                            </div>
                                            <div className="mb-4">
                                              <label className="block text-gray-700">
                                                Account Holder's Name:
                                              </label>
                                              <input
                                                type="text"
                                                name="customerBankAccountName"
                                                value={
                                                  cancelBookingInfo.customerBankAccountName
                                                }
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded mt-2"
                                                required
                                              />
                                            </div>
                                          </form>
                                        </>
                                      ) : (
                                        <p>
                                          No bank information needed for "In
                                          Cash" payment type.
                                        </p>
                                      )}

                                      <Button
                                        className="mt-4 w-full bg-red-600"
                                        onClick={handleCancelBooking}
                                      >
                                        Confirm Cancel
                                      </Button>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                {/* Rebook Button: Only show for Succeeded and Cancelled bookings */}
                                {(booking.bookingStatus === "Succeeded" ||
                                  booking.bookingStatus === "Cancelled") && (
                                  <Button
                                    variant="default"
                                    onClick={() => rebookAppointment(booking)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-md 
                                               shadow-lg hover:shadow-blue-500/50 transition-all duration-300 ease-in-out
                                               hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 
                                               active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                  >
                                    <motion.span
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 1 }}
                                      whileHover={{ opacity: 1 }}
                                    >
                                      Rebook
                                    </motion.span>
                                  </Button>
                                )}
                              </CardFooter>
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
                          src="https://firebasestorage.googleapis.com/v0/b/swp391veterinary.appspot.com/o/The%20Sad%20Snowman%20-%20Falling%20Apart.png?alt=media&token=65d7dec8-75d8-4b9a-b79e-df8882d4b22f"
                          alt="No bookings"
                          className="w-32 h-32 mb-4"
                        />
                        <p className="text-gray-500 dark:text-gray-400">
                          No bookings found for this status.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSuccess}
        newStatus="Success"
      />
    </div>
  );
};

export default BookingCus;
