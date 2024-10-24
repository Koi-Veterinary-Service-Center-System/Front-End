import { Bell, Mail, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/configs/axios"; // Đảm bảo bạn đã config axios

export default function HeaderAd({ title }: { title: string }) {
  const [userProfile, setUserProfile] = useState({
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
    <header className="bg-gray-800 bg-opacity-50 border-b">
      <div className="container py-1">
        <div className="flex items-center justify-between ml-2">
          <div className="flex-col  items-center space-y-2">
            <h1 className="text-2xl font-semibold text-blue-500">
              Hi, {userProfile.firstName} {userProfile.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              Let's check your KaiService today
            </p>
            <h1 className="text-2xl font-semibold text-blue-500">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[200px] md:w-[300px] bg-white border border-gray-300 text-black"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-blue-500" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="sr-only">Messages</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="w-16 h-16">
                {" "}
                {/* Điều chỉnh kích thước avatar */}
                <AvatarImage
                  src={userProfile.imageURL || "/placeholder.svg"}
                  alt={userProfile.userName}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="w-full h-full bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full">
                  {userProfile?.firstName?.[0]}
                  {userProfile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none text-blue-500">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p className="text-xs text-gray-500">{userProfile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
