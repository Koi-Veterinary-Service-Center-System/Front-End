import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../OverviewPage/CategoryDistributionChart";
import HeaderAd from "@/components/Header/headerAd";
import ServicesTable from "@/components/services/ServicesTable";
import SalesTrendChart from "@/components/services/SalesTrendChart";
import { toast } from "sonner"; // Use sonner for toast notifications
import { useEffect, useState } from "react";
import api from "@/configs/axios"; // Ensure API is configured

const Service = () => {
  const [isLoadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSelling, setTopSelling] = useState(0); // Placeholder for top selling
  const [lowService, setLowService] = useState(0); // Placeholder for low service

  // Function to show delete success toast
  const handleDeleteSuccess = () => {
    toast.success("Service deleted successfully");
  };

  const handleAddSuccess = () => {
    toast.success("Service added successfully");
  };

  // Fetch Services and calculate stats
  useEffect(() => {
    const fetchServicesAndRevenue = async () => {
      try {
        setLoadingServices(true);

        // Call API to get all services
        const servicesResponse = await api.get("/service/all-service");
        const servicesData = servicesResponse.data;
        setServices(servicesData);

        // Call API to get all bookings and calculate total revenue
        const bookingsResponse = await api.get("/booking/all-booking");
        const bookingsData = bookingsResponse.data;

        // Calculate total revenue by summing totalAmount from bookings
        const totalRev = bookingsData.reduce((total, booking) => {
          return total + booking.totalAmount;
        }, 0);
        setTotalRevenue(totalRev);

        // Logic for other statistics (dummy data for now)
        setTopSelling(servicesData.length > 0 ? 89 : 0); // Placeholder for top-selling
        setLowService(
          servicesData.filter((service) => service.price < 100).length
        ); // Low service example
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesAndRevenue();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
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
              value={services.length} // Tổng số dịch vụ
              color="#6366F1"
            />
            <StatCard
              name="Top Selling"
              icon={TrendingUp}
              value={topSelling} // Placeholder cho dịch vụ bán chạy nhất
              color="#10B981"
            />
            <StatCard
              name="Low Service"
              icon={AlertTriangle}
              value={lowService} // Số dịch vụ có giá thấp
              color="#F59E0B"
            />
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })} // Tổng doanh thu
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
      </div>
    </div>
  );
};

export default Service;
