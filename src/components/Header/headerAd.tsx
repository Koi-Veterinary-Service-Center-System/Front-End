import { useEffect, useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/configs/axios";

interface UserProfile {
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  imageURL: string;
}

export default function HeaderAd({ title }: { title: string }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userName: "",
    firstName: "",
    lastName: "",
    role: "",
    imageURL: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-100 to-white border-b border-blue-200">
      <div className="container py-4 ml-4">
        <div className="flex items-center justify-between">
          <div className="flex-col items-start space-y-2">
            <h1 className="text-2xl font-semibold text-blue-700">
              Hi, {userProfile.firstName} {userProfile.lastName}
            </h1>
            <p className="text-sm text-blue-600">
              Let&apos;s check your KaiService today
            </p>
            <h1 className="text-2xl font-semibold text-blue-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="w-16 h-16 border-2 border-blue-300">
                <AvatarImage
                  src={userProfile.imageURL || "/placeholder.svg"}
                  alt={userProfile.userName}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="w-full h-full bg-blue-200 text-blue-800 text-2xl flex items-center justify-center rounded-full">
                  {userProfile?.firstName?.[0]}
                  {userProfile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none text-blue-800">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p className="text-xs text-blue-600">{userProfile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
