import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../configs/axios";
import { Button, Input } from "antd";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/info";
import SlidebarProfile from "@/components/Sidebar/SlidebarProfile";

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const backgroundStyle = {
    backgroundImage: "url('src/assets/images/subtle-prism.png')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };

  useEffect(() => {
    if (location.state && location.state.updateProfileSuccess) {
      toast.success("Profile updated successfully!");
      // window.history.replaceState({}, document.title);
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
        gender:
          response.data.gender === undefined
            ? "None"
            : response.data.gender
            ? "Male"
            : "Female",
      };

      setProfile(genderProfile);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const mainContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
        <SlidebarProfile />

        <motion.main
          className="flex-1 bg-white dark:bg-gray-900"
          initial="hidden"
          animate="visible"
          variants={mainContentVariants}
          style={backgroundStyle}
        >
          <header className="bg-white dark:bg-gray-800 shadow  bg-gradient-to-br from-blue-50 to-blue-400">
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
                  <AvatarImage
                    src={profile.imageURL}
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
    </div>
  );
}

export default ProfilePage;
