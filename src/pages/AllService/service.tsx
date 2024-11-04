import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import HeaderAd from "@/components/Header/headerAd";
import ServicesTable from "@/components/services/ServicesTable";
import SalesTrendChart from "@/components/services/SalesTrendChart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "@/configs/axios";
import CategoryDistributionChart from "@/components/services/CategoryDistributionChart";

const Service = () => {
  const [isLoadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSelling, setTopSelling] = useState(0);
  const [lowService, setLowService] = useState(0);

  const handleDeleteSuccess = () => {
    toast.success("Service deleted successfully");
  };

  const handleAddSuccess = () => {
    toast.success("Service added successfully");
  };

  useEffect(() => {
    const fetchServicesAndRevenue = async () => {
      try {
        setLoadingServices(true);
        const servicesResponse = await api.get("/service/all-service");
        const servicesData = servicesResponse.data;
        setServices(servicesData);

        const bookingsResponse = await api.get("/booking/all-booking");
        const bookingsData = bookingsResponse.data;

        const totalRev = bookingsData.reduce((total, booking) => {
          return total + booking.totalAmount;
        }, 0);
        setTotalRevenue(totalRev);

        setTopSelling(servicesData.length > 0 ? 89 : 0);
        setLowService(
          servicesData.filter((service) => service.price < 100).length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesAndRevenue();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <HeaderAd title="Services" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Services"
              icon={Package}
              value={services.length}
              color="#3B82F6"
            />
            <StatCard
              name="Top Selling"
              icon={TrendingUp}
              value={topSelling}
              color="#10B981"
            />
            <StatCard
              name="Low Service"
              icon={AlertTriangle}
              value={lowService}
              color="#F59E0B"
            />
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
              color="#EF4444"
            />
          </motion.div>

          <ServicesTable
            onDeleteSuccess={handleDeleteSuccess}
            onAddSuccess={handleAddSuccess}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesTrendChart />
            <CategoryDistributionChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Service;
