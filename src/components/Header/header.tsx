import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { profile } from "../../types/info";
import { motion } from "framer-motion";
import api from "../../configs/axios";
import {
  Bell,
  CalendarCheck2,
  Check,
  Gauge,
  Heart,
  Pill,
  RefreshCw,
  User2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TbLogout } from "react-icons/tb";
import { TbLogin } from "react-icons/tb";
import { TbRegistered } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Notification = {
  id: number;
  type: "booking" | "refund";
  message: string;
};

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [profile, setProfile] = useState<profile | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => setIsMenuOpen(true);
  const handleMouseLeave = () => setIsMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "booking",
      message:
        "Your booking has been booked successfully for tomorrow at 9:00 AM.",
    },
    {
      id: 2,
      type: "refund",
      message:
        "Your refund of $50 for the cancelled appointment has been processed.",
    },
  ]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md py-4"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="src\assets\images\logo.png"
            alt="Koine logo"
            className="h-20 w-auto"
          />
          <span className="text-xl font-bold">Koine</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {" "}
          {/* Adjust space-x for horizontal gap */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/about-us" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact-us"
              className="text-gray-600 hover:text-gray-900"
            >
              Contact Us
            </Link>
          </motion.div>
        </nav>

        <div className="flex items-center space-x-2">
          {["Manager", "Staff"].includes(profile?.role) && (
            <Link to="/overview">
              <Button variant="ghost" size="icon">
                <Gauge className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {profile?.role === "Vet" && (
            <Link to="/prescription">
              <Button variant="ghost" size="icon">
                <Pill className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link to="/favorites">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <Button variant="ghost" size="sm" onClick={clearNotifications}>
                  Clear all
                </Button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No new notifications
                </p>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-start space-x-4 rounded-md bg-muted p-3"
                      >
                        <div
                          className={`mt-1 rounded-full p-1 ${
                            notification.type === "booking"
                              ? "bg-green-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {notification.type === "booking" ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Just now
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </PopoverContent>
          </Popover>
          {["Vet", "Customer"].includes(profile?.role) && (
            <Link to="/schedulesV">
              <Button variant="ghost" size="icon">
                <CalendarCheck2 className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {isLoggedIn ? (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile?.imageURL} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {profile?.firstName?.[0]}
                      {profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {/* Removed Chevron Icon */}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="p-4 space-y-2 text-lg"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 w-full"
                  >
                    <ImProfile className="text-blue-500 h-6 w-6" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:bg-red-100 hover:text-red-600"
                >
                  <TbLogout className="text-red-600 h-6 w-6" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <User2Icon className="h-6 w-6" />
                  {/* Removed Chevron Icon */}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="p-4 space-y-2 text-lg"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 w-full"
                  >
                    <TbLogin className="text-blue-500 h-6 w-6" />
                    <span>Login</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 w-full"
                  >
                    <TbRegistered className="text-blue-500 h-6 w-6" />
                    <span>Register</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
