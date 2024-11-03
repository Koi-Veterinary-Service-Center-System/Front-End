import { motion } from "framer-motion";
import { ArrowLeft, Store, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
export default function SlidebarProfile() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };
  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };
  return (
    <motion.aside
      className="w-52 bg-gray-100 dark:bg-gray-800 h-screen sticky top-0"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <img src="src\assets\images\logo.png" alt="" />
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
              <span>All Service</span>
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
  );
}
