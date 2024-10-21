import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import HeaderAd from "@/components/common/header";
import StatCard from "@/components/common/StatCard";
import OrdersTable from "@/components/BookingManager/BookingTable";
import Sidebar from "@/components/Sidebar/sidebar";

const orderStats = {
  totalOrders: "1,234",
  pendingOrders: "56",
  completedOrders: "1,178",
  totalRevenue: "$98,765",
};

const BookMPage = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Booking" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Bookings"
              icon={ShoppingBag}
              value={orderStats.totalOrders}
              color="#6366F1"
            />
            <StatCard
              name="Pending Bookings"
              icon={Clock}
              value={orderStats.pendingOrders}
              color="#F59E0B"
            />
            <StatCard
              name="Completed Bookings"
              icon={CheckCircle}
              value={orderStats.completedOrders}
              color="#10B981"
            />
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={orderStats.totalRevenue}
              color="#EF4444"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* <DailyOrders />
          <OrderDistribution /> */}
          </div>

          <OrdersTable />
        </main>
      </div>
    </div>
  );
};
export default BookMPage;
