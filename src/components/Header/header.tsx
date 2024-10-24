import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { profile } from "../../types/info";
import { AnimatePresence, motion } from "framer-motion";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
            src="/src/assets/images/logo.png"
            alt="Koine logo"
            className="h-12 w-auto sm:h-16 md:h-20"
          />
          <span className="text-xl font-bold hidden sm:inline">Koine</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-2">
          <UserActions
            profile={profile}
            notifications={notifications}
            clearNotifications={clearNotifications}
          />
          <AuthButtons
            isLoggedIn={isLoggedIn}
            profile={profile}
            handleLogout={handleLogout}
          />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            <nav className="flex flex-col space-y-4 p-4">
              <NavLinks />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLinks() {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/services">Services</NavLink>
      <NavLink to="/about-us">About Us</NavLink>
      <NavLink to="/contact-us">Contact Us</NavLink>
    </>
  );
}

function NavLink({ to, children }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link to={to} className="text-gray-600 hover:text-gray-900">
        {children}
      </Link>
    </motion.div>
  );
}

function UserActions({ profile, notifications, clearNotifications }) {
  return (
    <>
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
      <NotificationsPopover
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
      {["Vet", "Customer"].includes(profile?.role) && (
        <Link to="/schedulesV">
          <Button variant="ghost" size="icon">
            <CalendarCheck2 className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </>
  );
}

function NotificationsPopover({ notifications, clearNotifications }) {
  return (
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
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-4 rounded-md bg-muted p-3"
    >
      <div
        className={`mt-1 rounded-full p-1 ${
          notification.type === "booking" ? "bg-green-100" : "bg-blue-100"
        }`}
      >
        {notification.type === "booking" ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <RefreshCw className="h-4 w-4 text-blue-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">Just now</p>
      </div>
    </motion.div>
  );
}

function AuthButtons({ isLoggedIn, profile, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => setIsMenuOpen(true);
  const handleMouseLeave = () => setIsMenuOpen(false);

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isLoggedIn ? (
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
              <AvatarImage
                src={profile?.imageURL}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="text-lg">
                {profile?.firstName?.[0]}
                {profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User2Icon className="h-6 w-6" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-4 space-y-2 text-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/login" className="flex items-center space-x-2 w-full">
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Header;
