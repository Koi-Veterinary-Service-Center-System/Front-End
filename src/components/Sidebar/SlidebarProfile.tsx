"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Store, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SlidebarProfile() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const sidebarVariants = {
    hidden: { x: isMobile ? "-100%" : -300 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        when: "beforeChildren",
      },
    },
  };

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
    if (isMobile) setIsOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <>
      <div className="p-4 flex justify-center items-center">
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/swp391veterinary.appspot.com/o/logo.png?alt=media&token=a26711fc-ed75-4e62-8af1-ec577334574a"
            alt="Logo"
            className="h-20 w-20 "
          />
        </Link>
      </div>
      <nav className="mt-8 flex justify-center items-center">
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
              to="/bookingCus"
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
      <div className="absolute bottom-6 left-6 right-6">
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
    </>
  );

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            className={`bg-gray-100 dark:bg-gray-800 h-screen ${
              isMobile
                ? "fixed top-0 left-0 w-64 z-40 shadow-lg"
                : "sticky top-0 w-52"
            }`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
