import "./header.scss";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { profile } from "../../types/info";
import api from "../../configs/axios";
import {
  Bell,
  CalendarCheck2,
  Check,
  Gauge,
  Heart,
  Pill,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

type Notification = {
  id: number;
  type: "booking" | "refund";
  message: string;
};

function Header() {
  const { Search } = Input;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [profile, setProfile] = useState<profile | null>(null);
  const [isLoading, setLoading] = useState(false);
  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    }
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      try {
        setLoading(true);
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setProfile(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Optionally remove user info
    setIsLoggedIn(false); // Set logged-in state to false
    navigate("/login"); // Redirect to login page
  };

  const onSearch = (value: string) => {
    console.log("Searching for:", value);
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
    <>
      <header className="header_hd">
        <Link to="/">
          <img src="src/assets/images/logo.png" alt="Koine logo" />
        </Link>

        <nav>
          <ul className="nav__links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/allservice">Serivces</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <Form className="search-bar-hd" onFinish={onSearch}>
          <Form.Item>
            <input type="text" placeholder="Search products..." />
          </Form.Item>
          <button>
            <i className="bx bx-search-alt"></i>
          </button>
        </Form>

        <div className="icons">
          {["Manager", "Staff"].includes(profile?.role) && (
            <Link to="/admin" className="absolute text-xs">
              <Gauge />
            </Link>
          )}
          {profile?.role === "Vet" && (
            <Link to="/prescription" className="heart-icon">
              <Pill />
            </Link>
          )}
          <Link to="/favorites" className="heart-icon">
            <Heart />
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                )}
                <span className="sr-only">Toggle notifications</span>
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
                      <div
                        key={notification.id}
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </PopoverContent>
          </Popover>
          {["Vet", "Customer"].includes(profile?.role) && (
            <Link to="/schedulesV" className="cart-icon" data-count="2">
              <CalendarCheck2 />
            </Link>
          )}

          <div>
            {isLoggedIn ? (
              <div className="user-profile-dropdown">
                <div className="user-icon">
                  <Avatar className="bg-gray-500">
                    <AvatarImage src={profile?.imageURL} alt="Profile" />
                    <AvatarFallback>
                      {profile?.firstName?.[0]}
                      {profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <i className="ion-chevron-down"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile">
                        <Button className="btn-view">
                          <i className="bx bx-user-circle"></i>View Profile
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Button className="btn-logout" onClick={handleLogout}>
                        <i className="bx bxs-log-out-circle"></i>Logout
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="user-profile-dropdown">
                <div className="user-icon">
                  <i className="bx bx-user"></i>
                  <i className="ion-chevron-down"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/login">
                        <Button>Login</Button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/register#register-container">
                        <Button>Register</Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
