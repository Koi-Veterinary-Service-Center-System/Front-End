import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../OverviewPage/CategoryDistributionChart";
import HeaderAd from "@/components/common/header";
import ServicesTable from "@/components/services/ServicesTable";
import SalesTrendChart from "@/components/services/SalesTrendChart";
const Service = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />;
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Services" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Products"
              icon={Package}
              value={1234}
              color="#6366F1"
            />
            <StatCard
              name="Top Selling"
              icon={TrendingUp}
              value={89}
              color="#10B981"
            />
            <StatCard
              name="Low Stock"
              icon={AlertTriangle}
              value={23}
              color="#F59E0B"
            />
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={"$543,210"}
              color="#EF4444"
            />
          </motion.div>

          <ServicesTable />

          {/* CHARTS */}
          <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
            {/* <SalesTrendChart /> */}
            <SalesTrendChart />
            <CategoryDistributionChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Service;