import { UserCheck, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";
import HeaderAd from "@/components/Header/headerAd";
import StatCard from "@/components/common/StatCard";
import UsersTable from "@/components/users/UsersTable";
import Sidebar from "@/components/Sidebar/sidebar";
import { useEffect, useState } from "react";
import { User } from "@/types/info";
import api from "@/configs/axios";
import dayjs from "dayjs"; // Ensure you have installed dayjs for date comparison

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [churnRate, setChurnRate] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const fetchUser = async () => {
    try {
      const response = await api.get("User/all-user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const allUsers = response.data;
      const oneMonthAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
      const activeUsersCount = allUsers.filter(
        (user: User) => user.isActive
      ).length;
      // Tổng số người dùng
      setTotalUsers(allUsers.length);

      setActiveUsers(activeUsersCount);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white  opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />;
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Users" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-8 max-w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
              <StatCard
                name="Total Users"
                icon={UsersIcon}
                value={totalUsers.toLocaleString()}
                color="#6366F1"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
              <StatCard
                name="Active Users"
                icon={UserCheck}
                value={activeUsers.toLocaleString()}
                color="#F59E0B"
              />
            </div>
          </motion.div>
          <UsersTable />
          {/* USER CHARTS
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <UserGrowthChart />
            <UserActivityHeatmap />
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
