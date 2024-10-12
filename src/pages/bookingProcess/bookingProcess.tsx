import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../configs/axios";
import { Booking, profile } from "../../types/info";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Process = () => {
  const [profile, setProfile] = useState<profile | null>(null);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch all booking and calculate totals
  const fetchBooking = async (userId: string) => {
    try {
      const response = await api.get(`/booking/view-booking-process`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });

      console.log("API Response:", response.data);
      const fetchedBookings = response.data;
      setBookings(fetchedBookings);
      console.log("Fetched Bookings:", fetchedBookings);
    } catch (error) {
      console.error("Fetch error:", error);
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
    console.log("Fetching profile...");
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchBooking();
  }, []);

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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              {error && <div className="text-red-500 mb-4">{error}</div>}
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
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No bookings available.
                  </p>
                )}
              </div>
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Process;
