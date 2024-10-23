import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import HeaderAd from "@/components/common/header";
import StatCard from "@/components/common/StatCard";
import UserActivityHeatmap from "@/components/users/UserActivityHeatmap";
import UserDemographicsChart from "@/components/users/UserDemographicsChart";
import UsersTable from "@/components/users/UsersTable";
import UserGrowthChart from "@/components/users/UserGrowthChart";
import Sidebar from "@/components/Sidebar/sidebar";
import { useEffect, useState } from "react";
import { User } from "@/types/info";
import api from "@/configs/axios";

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUser = async () => {
    try {
      const response = await api.get("User/all-user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
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
              value={userStats.totalUsers.toLocaleString()}
              color="#6366F1"
            />
            <StatCard
              name="New Users Today"
              icon={UserPlus}
              value={userStats.newUsersToday}
              color="#10B981"
            />
            <StatCard
              name="Active Users"
              icon={UserCheck}
              value={userStats.activeUsers.toLocaleString()}
              color="#F59E0B"
            />
            <StatCard
              name="Churn Rate"
              icon={UserX}
              value={userStats.churnRate}
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
