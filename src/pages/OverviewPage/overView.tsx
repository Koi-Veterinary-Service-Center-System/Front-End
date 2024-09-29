import HeaderAd from "@/components/common/header";
import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";

const OverviewPage = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Overview" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Sales"
              icon={Zap}
              value="$12,345"
              color="#6366F1"
            />
            <StatCard
              name="New Users"
              icon={Users}
              value="1,234"
              color="#885CF6"
            />
            <StatCard
              name="Total Products"
              icon={ShoppingBag}
              value="567"
              color="#EC4899"
            />
            <StatCard
              name="Conversion Rate"
              icon={BarChart2}
              value="12.5%"
              color="#10B981"
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default OverviewPage;
