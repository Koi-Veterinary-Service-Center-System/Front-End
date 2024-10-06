"use client";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../configs/axios";
import { Button, Input } from "antd";
import { Toaster, toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  MessageSquare,
  Moon,
  Store,
  Sun,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  imageURL: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  gender: string;
  address: string;
  email: string;
  phoneNumber: string;
}

function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.updateProfileSuccess) {
      toast.success("Profile updated successfully!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/User/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const genderProfile = {
        ...response.data,
        gender: response.data.gender ? "Male" : "Female",
      };

      setProfile(genderProfile);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const mainContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
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
                    activeMenuItem === "dashboard"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("dashboard")}
                >
                  <User className="h-5 w-5" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "my-store"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("my-store")}
                >
                  <Store className="h-5 w-5" />
                  <span>Service History</span>
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

        <motion.main
          className="flex-1 bg-white dark:bg-gray-900"
          initial="hidden"
          animate="visible"
          variants={mainContentVariants}
        >
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Profile
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
                  <AvatarImage src={profile.imageURL} alt="Profile" />
                  <AvatarFallback>
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={profile.userName} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={`${profile.firstName} ${profile.lastName}`}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profile.role} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" value={profile.gender} readOnly />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={profile.address} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" value={profile.email} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profile.phoneNumber} readOnly />
                    </div>
                    <div className="flex justify-end">
                      <Button asChild>
                        <Link to="/updateProfile">Edit Profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.main>
      </div>
      <Toaster />
    </div>
  );
}

export default Profile;
