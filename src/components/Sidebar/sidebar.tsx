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
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "@/configs/axios";
import { Profile } from "@/types/info";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", path: "/overview" },
  { name: "Service", icon: ShoppingBag, color: "#8B5CF6", path: "/service" },
  { name: "Users", icon: Users, color: "#EC4899", path: "/users" },
  { name: "Schedules", icon: Calendar, color: "#10B981", path: "/schedules" },
  {
    name: "Booking",
    icon: TbBrandBooking,
    color: "#F59E0B",
    path: "/bookings",
  },
  {
    name: "FeedBack",
    icon: VscFeedback,
    color: "#3B82F6",
    path: "/feedbackmanager",
  },
  { name: "HomePage", icon: House, color: "#3B82F6", path: "/" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", path: "/settings" },
];

const Sidebar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
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
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-gray-900 ${
        isSideBarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSideBarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-900 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            ease: "linear",
            duration: 2,
            x: { duration: 1 },
          }}
        >
          <img
            src="src/assets/images/logo.png"
            alt="Logo"
            className="w-full h-48"
          />
        </motion.div>

        {/* Navigation starts */}
        <nav className="mt-8 flex flex-col items-center flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => {
            // Kiểm tra nếu vai trò của người dùng là "manager" và tên của item là "FeedBack"
            if (profile?.role === "Manager" && item.name === "FeedBack") {
              return null; // Không render nút "FeedBack" cho manager
            }

            return (
              <Link key={index} to={item.path}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSideBarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
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
            );
          })}
        </nav>

        {/* Navigation ends */}
      </div>
    </motion.div>
  );
};

export default Sidebar;
