import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import { Booking, Profile } from "../../types/info";
import {
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Download,
  Moon,
  Sun,
  MessageSquare,
  Store,
  User,
  CalendarClock,
  ArrowLeft,
  Eye,
  AlertCircle,
} from "lucide-react";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiCheckboxChecked } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";
import { CiViewList } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusOptions = [
  "Scheduled",
  "Ongoing",
  "Completed",
  "Succeeded",
  "Cancelled",
] as const;
type Status = (typeof statusOptions)[number]; // Create a type from statusOptions array

// Map each status to an icon component
const statusIcons: Record<Status, React.ElementType> = {
  Scheduled: AiOutlineSchedule,
  Ongoing: Users,
  Completed: BiCheckboxChecked,
  Succeeded: DollarSign,
  Cancelled: AlertCircle,
};

const History = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]); // Changed to array
  const [totalBookings, setTotalBookings] = useState(0);
  const backgroundStyle = {
    backgroundImage: "url('src/assets/images/subtle-prism.png')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };
  const [activeStatus, setActiveStatus] = useState<Status>("Scheduled");

  // Fetch all booking and calculate totals
  const fetchBooking = async (userId?: string) => {
    try {
      const response = await api.get(`/booking/view-booking-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });
      const fetchedBookings = response.data;
      setBookings(fetchedBookings);

      setTotalBookings(fetchedBookings.length);
    } catch (error: any) {
      toast.info(error.response.data);
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
    fetchProfile();
    fetchBooking();
  }, []);

  // Memoize the booking totals to avoid recalculating them unnecessarily
  const bookingSummary = useMemo(
    () => ({
      totalBookings,
    }),
    [totalBookings]
  );

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
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
          <div className="absolute bottom-6 left-6">
            <Button
              variant="default"
              size="lg"
              className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </div>
        </motion.aside>

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
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <motion.div
              className="space-y-8 mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="justify-center align-middle">
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="flex flex-wrap gap-2">
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
                            onClick={() => setActiveStatus(status)}
                            className={`flex items-center gap-2 ${
                              activeStatus === status
                                ? "bg-blue-500 text-white" // Blue background and white text for the active button
                                : "hover:bg-blue-500 hover:text-white" // Hover effect for other buttons
                            } transition-colors duration-200`}
                          >
                            <Icon className="h-4 w-4" />
                            {status}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Booking
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookingSummary.totalBookings}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Money
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,543</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Date Booking</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.bookingDate}>
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <Avatar>
                                <AvatarImage
                                  src={profile?.imageURL}
                                  alt="User"
                                />
                                <AvatarFallback>
                                  {profile?.firstName?.[0]}
                                  {profile?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {profile?.firstName} {profile?.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-2">{booking.bookingDate}</td>
                          <td className="py-2">
                            {booking.bookingStatus.toLowerCase() ===
                            "succeeded" ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {booking.bookingStatus}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                {booking.bookingStatus}
                              </span>
                            )}
                          </td>
                          <td className="py-2 flex text-lg gap-3">
                            <CiViewList className="text-yellow-300" />

                            {booking.bookingStatus !== "Cancelled" && ( // Check if the status is not "Cancelled"
                              <Link to={`/feedback/${booking.bookingID}`}>
                                <VscFeedback className="text-blue-500" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
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
