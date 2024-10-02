import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../OverviewPage/CategoryDistributionChart";
import HeaderAd from "@/components/common/header";
import ServicesTable from "@/components/services/ServicesTable";
import SalesTrendChart from "@/components/services/SalesTrendChart";
import { Toaster, toast } from "sonner"; // Use sonner for toast notifications

const Service = () => {
  // Function to show delete success toast
  const handleDeleteSuccess = () => {
    toast.success("Service deleted successfully");
  };

  const handleAddSuccess = () => {
    toast.success("Service added sucessfully");
  };

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
              name="Total Services"
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
              name="Low Service"
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

          {/* Pass handleDeleteSuccess as a prop to ServicesTable */}
          <ServicesTable
            onDeleteSuccess={handleDeleteSuccess}
            onAddSuccess={handleAddSuccess}
          />

          {/* CHARTS */}
          <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
            <SalesTrendChart />
            <CategoryDistributionChart />
          </div>
        </main>

        {/* Toaster component to show toast notifications */}
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
};

export default Service;
