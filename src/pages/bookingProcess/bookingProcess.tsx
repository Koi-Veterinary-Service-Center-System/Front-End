import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios";
import { Booking, Profile } from "../../types/info";
import {
  ChevronLeft,
  Moon,
  Sun,
  MessageSquare,
  Store,
  User,
  CalendarClock,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircle2,
  DollarSign,
  Loader2,
  Activity,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    label: "On-going",
    icon: <Activity className="h-4 w-4" />,
    color: "bg-purple-400",
  },
  {
    label: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-400",
  },
  {
    label: "Received Money",
    icon: <DollarSign className="h-4 w-4" />,
    color: "bg-emerald-400",
  },
];

const StatusComponent = ({ currentStatus }: { currentStatus?: string }) => {
  const currentIndex = statusSteps.findIndex(
    (step) => step.label === currentStatus
  );

  // Tính toán chiều dài của đường chạy
  const progressPercentage = (currentIndex / (statusSteps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Đường phía sau các icon */}
        <div className="absolute top-5 w-full h-1 bg-gray-200"></div>

        {/* Đường di chuyển theo trạng thái */}
        <motion.div
          className="absolute top-5 h-1 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }} // Điều chỉnh độ dài dựa trên trạng thái
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
                {/* Nếu là trạng thái "Pending", thêm hiệu ứng quay cho Loader2 */}
                {step.label === "Pending" && index <= currentIndex ? (
                  <motion.div
                    animate={{ rotate: 360 }} // Hiệu ứng quay 360 độ
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }} // Lặp lại vô hạn
                  >
                    {step.icon}
                  </motion.div>
                ) : (
                  step.icon // Các biểu tượng khác hiển thị tĩnh
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

const Process = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  // Fetch all booking and calculate totals
  // Fetch all booking and calculate totals based on the user's role
  const fetchBooking = async (userId: string) => {
    try {
      // Determine the endpoint based on user role
      const endpoint =
        profile?.role === "Staff"
          ? `/booking/all-booking`
          : `/booking/view-booking-process`;

      // Fetch bookings from the determined endpoint
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });

      // Set the bookings data
      const fetchedBookings = response.data;
      setBookings(fetchedBookings);
      console.log("Fetched Bookings:", fetchedBookings);
    } catch (error) {
      console.error("Fetch error:", error); // Log the entire error object
      const errorMessage =
        error.response?.data?.message || "Failed to fetch bookings";
      console.log("Error message:", errorMessage);
      setError(errorMessage);
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
    } catch (error) {
      console.error("Error fetching profile:", error); // Log full error
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile data";
      console.log("Error message:", errorMessage); // Log specific error message
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  // Call fetchBooking in useEffect
  // Fetch Profile once on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchBooking();
  }, []);

  const handlePayOnline = async (bookingID: Booking) => {
    try {
      // Make the POST request to the API endpoint with bookingId as a query parameter
      const response = await api.post(`/payment/create-paymentUrl`, null, {
        params: { bookingID },
      });

      // If the request is successful, process the response (e.g., redirect to payment URL)
      if (response.status === 200 && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect to the payment URL

        // After redirecting for payment, we can't automatically check for status,
        // so we will add a listener or refresh bookings manually on return

        // Wait for the user to come back and then refresh bookings
        // Note: This requires the user to return back to the page after payment
        window.onfocus = () => {
          fetchBooking(); // Refresh bookings to get the latest status
          window.onfocus = null; // Remove the event listener after fetching once
        };
      } else {
        console.error("Failed to retrieve payment URL.");
        toast.error("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("An error occurred while initiating the payment.");
    }
  };

  const handleUpdateStatus = async (
    bookingID: Booking,
    bookingStatus: Booking
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
        fetchBooking(); // Refresh bookings to show updated status
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("An error occurred while updating the booking status.");
    }
  };

  const openCancelDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    try {
      await api.patch(
        `/booking/cancel-booking/${selectedBookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Booking ${selectedBookingId} has been cancelled`);
      setIsCancelDialogOpen(false);
      fetchBooking(); // Refresh bookings after cancellation
    } catch (error) {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? "dark" : ""}`}>
      <div className="flex ">
        <motion.aside
          className="w-64 bg-gray-100 dark:bg-gray-800 h-screen sticky top-0"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          <div className="p-4">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <User className="h-6 w-6" />
              <span className="text-xl font-bold">Profile</span>
            </Link>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "profile"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("profile")}
                >
                  <User className="h-5 w-5" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "history"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("history")}
                >
                  <Store className="h-5 w-5" />
                  <span>Service History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "process"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("process")}
                >
                  <CalendarClock className="h-5 w-5" />
                  <span>Service Process</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/message"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "message"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("message")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Message</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-4 left-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </motion.aside>

        <main className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow">
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
                  <AvatarImage src={profile?.imageURL} alt="Profile" />
                  <AvatarFallback>
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Booking Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.bookingID} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {booking.serviceName}
                          </CardTitle>
                          <Badge
                            className={getStatusColor(booking.bookingStatus)}
                          >
                            {booking.bookingStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={booking.vetImageURL}
                              alt={booking.vetName}
                            />
                            <AvatarFallback>
                              {booking.vetName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{booking.vetName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Veterinarian
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{booking.bookingDate}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {booking.slotStartTime} - {booking.slotEndTime}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CreditCardIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>${booking.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <StatusComponent
                          currentStatus={booking.bookingStatus}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        {profile?.role === "Staff" ? (
                          // Buttons for staff to update status
                          <>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(
                                  booking.bookingID,
                                  "Scheduled"
                                )
                              }
                            >
                              Set Scheduled
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(
                                  booking.bookingID,
                                  "Completed"
                                )
                              }
                            >
                              Set Completed
                            </Button>
                          </>
                        ) : (
                          // Conditional buttons for customers
                          <>
                            {["Scheduled", "Completed"].includes(
                              booking.bookingStatus
                            ) ? (
                              <Button
                                className="bg-blue-400"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateStatus(
                                    booking.bookingID,
                                    "Success"
                                  )
                                }
                              >
                                Confirm to Success
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handlePayOnline(booking.bookingID)
                                }
                              >
                                Pay Online
                              </Button>
                            )}
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
                                  <DialogTitle>Cancel Booking</DialogTitle>
                                </DialogHeader>
                                <p>
                                  Are you sure you want to cancel this booking?
                                </p>
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
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No bookings available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Process;
