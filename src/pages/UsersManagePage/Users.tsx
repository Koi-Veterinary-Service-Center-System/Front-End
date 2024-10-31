import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import HeaderAd from "@/components/Header/headerAd";
import StatCard from "@/components/common/StatCard";
import UserActivityHeatmap from "@/components/users/UserActivityHeatmap";
import UsersTable from "@/components/users/UsersTable";
import UserGrowthChart from "@/components/users/UserGrowthChart";
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
      const today = dayjs().format("YYYY-MM-DD");
      const oneMonthAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

      // Tổng số người dùng
      setTotalUsers(allUsers.length);

      // Người dùng mới hôm nay
      const newUsers = allUsers.filter(
        (user) => dayjs(user.created_at).format("YYYY-MM-DD") === today
      );
      setNewUsersToday(newUsers.length);

      // Người dùng không hoạt động trong 30 ngày => Tính churn rate
      const inactiveUsers = allUsers.filter((user) =>
        dayjs(user.last_login).isBefore(oneMonthAgo)
      );
      const churnRateCalculated = (inactiveUsers.length / totalUsers) * 100;
      setChurnRate(churnRateCalculated.toFixed(2)); // Churn rate dạng phần trăm

      // Người dùng đang hoạt động (đăng nhập trong 30 ngày qua)
      const activeUsersCount = allUsers.length - inactiveUsers.length;
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
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Users"
              icon={UsersIcon}
              value={totalUsers.toLocaleString()}
              color="#6366F1"
            />
            <StatCard
              name="New Users Today"
              icon={UserPlus}
              value={newUsersToday}
              color="#10B981"
            />
            <StatCard
              name="Active Users"
              icon={UserCheck}
              value={activeUsers.toLocaleString()}
              color="#F59E0B"
            />
            <StatCard
              name="Churn Rate"
              icon={UserX}
              value={`${churnRate}%`}
              color="#EF4444"
            />
          </motion.div>

          <UsersTable />

          {/* USER CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <UserGrowthChart />
            <UserActivityHeatmap />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
