import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart2,
  Calendar,
  House,
  Menu,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { TbBrandBooking } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import api from "@/configs/axios";
import { Profile } from "@/types/info";

const SIDEBAR_ITEMS = [
  { name: "Service", icon: ShoppingBag, color: "#60A5FA", path: "/service" },
  { name: "Users", icon: Users, color: "#93C5FD", path: "/users" },
  { name: "Schedules", icon: Calendar, color: "#3B82F6", path: "/schedules" },
  {
    name: "Booking",
    icon: TbBrandBooking,
    color: "#3B82F6",
    path: "/bookings",
  },
  {
    name: "FeedBack",
    icon: VscFeedback,
    color: "#60A5FA",
    path: "/feedbackmanager",
  },
  { name: "HomePage", icon: House, color: "#93C5FD", path: "/" },
  { name: "Settings", icon: Settings, color: "#BFDBFE", path: "/settings" },
];

export default function Sidebar() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-gradient-to-b from-blue-50 to-white ${
        isSideBarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSideBarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-blue-100">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="p-2 rounded-full hover:bg-blue-100 transition-colors max-w-fit"
        >
          <Menu size={24} className="text-blue-600" />
        </motion.button>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            ease: "linear",
            duration: 2,
            x: { duration: 1 },
          }}
          className="align-middle justify-center flex"
        >
          <img
            src="src\assets\images\logo.png"
            alt="Logo"
            className="w-36 h-36"
          />
        </motion.div>

        <nav className="mt-8 flex flex-col items-center flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} to={item.path}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSideBarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap text-blue-800"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
