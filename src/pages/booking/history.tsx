import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios";
import { Booking, Profile } from "../../types/info";
import {
  Users,
  DollarSign,
  Search,
  Moon,
  Sun,
  AlertCircle,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
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

const statusOptions = [
  "Scheduled",
  "Ongoing",
  "Completed",
  "Received_Money",
  "Succeeded",
  "Cancelled",
] as const;
type Status = (typeof statusOptions)[number]; // Create a type from statusOptions array

// Map each status to an icon component
const statusIcons: Record<Status, React.ElementType> = {
  Scheduled: AiOutlineSchedule,
  Ongoing: Users,
  Completed: BiCheckboxChecked,
  Received_Money: FaRegMoneyBillAlt,
  Succeeded: DollarSign,
  Cancelled: AlertCircle,
};

const History = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const backgroundStyle = {
    backgroundImage: "url('src/assets/images/subtle-prism.png')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };
  const [activeStatus, setActiveStatus] = useState<Status>("Scheduled");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [cancelBookingInfo, setCancelBookingInfo] = useState({
    bankName: "",
    customerBankNumber: "",
    customerBankAccountName: "",
  });

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

      const fetchedBookings = response.data;
      setBookings(fetchedBookings); // Update the bookings state
    } catch (error: any) {
      setBookings([]); // Reset bookings on error
      toast.info(error.response?.data || "Failed to fetch bookings.");
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile data";
      setError(errorMessage);
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
    fetchBookingsByStatus(activeStatus); // Fetch bookings on initial load
  }, []); // Runs only once on component mount

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
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
        fetchBookingsByStatus(); // Refresh bookings to show updated status
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      toast.error(error.response.data);
    }
  };

  const openCancelDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };

  // Hàm để cập nhật thông tin Form
  const handleInputChange = (e) => {
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
      fetchBookingsByStatus(); // Refresh bookings after cancellation
    } catch (error: any) {
      toast.warning(error.response.data);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
        <SlidebarProfile />

        <main className="flex-1" style={backgroundStyle}>
          <header className="bg-white dark:bg-gray-800 shadow  bg-gradient-to-br from-blue-50 to-blue-400">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Services
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleDarkModeSwitch}
                  />
                  <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Avatar>
                  <AvatarImage
                    src={profile?.imageURL}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
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
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-blue-500" />
                  </div>
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
                                    {booking.serviceName}
                                  </CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <Link to="/detailB" className="block mb-4">
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
                                    <span>{booking.location}</span>
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
                                {/* Check if booking status is Succeeded or Cancelled */}
                                {["Succeeded", "Cancelled"].includes(
                                  booking.bookingStatus
                                ) ? (
                                  <Link to={`/feedback/${booking.bookingID}`}>
                                    <Button
                                      variant="outline"
                                      className="text-blue-500 hover:bg-blue-100"
                                    >
                                      <VscFeedback className="mr-2" />
                                      Feedback
                                    </Button>
                                  </Link>
                                ) : (
                                  <>
                                    {/* Confirm to Success Button */}
                                    {[
                                      "Scheduled",
                                      "Ongoing",
                                      "Completed",
                                      "Received_Money",
                                    ].includes(booking.bookingStatus) && (
                                      <Button
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                        variant="outline"
                                        onClick={() =>
                                          handleUpdateStatus(
                                            booking.bookingID,
                                            "Success"
                                          )
                                        }
                                        disabled={[
                                          "Pending",
                                          "Scheduled",
                                          "Ongoing",
                                          "Completed",
                                        ].includes(booking.bookingStatus)}
                                      >
                                        Confirm to Success
                                      </Button>
                                    )}

                                    {/* Cancel Booking Button */}
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
                                          disabled={[
                                            "Ongoing",
                                            "Completed",
                                            "Received_Money",
                                          ].includes(booking.bookingStatus)}
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
                                          booking? Please provide your bank
                                          information for any refunds.
                                        </p>

                                        {/* Form điền thông tin */}
                                        <form>
                                          <div className="mb-4">
                                            <label className="block text-gray-700">
                                              Bank Name:
                                            </label>
                                            <input
                                              type="text"
                                              name="bankName"
                                              value={cancelBookingInfo.bankName}
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
                                              Bank Account Holder's Name:
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

                                        <Button
                                          className="mt-4 w-full bg-red-600"
                                          onClick={handleCancelBooking}
                                        >
                                          Confirm Cancel
                                        </Button>
                                      </DialogContent>
                                    </Dialog>
                                  </>
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
                          src="src\assets\images\The Sad Snowman - Falling Apart.png"
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

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default History;
