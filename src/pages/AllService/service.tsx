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
import { Services } from "@/types/info";

interface BookingData {
  id: number;
  totalAmount: number;
  // Thêm các thuộc tính khác của booking nếu cần
}

const Service = () => {
  const [isLoadingServices, setLoadingServices] = useState<boolean>(false);
  const [services, setServices] = useState<Services[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topSelling, setTopSelling] = useState<number>(0);
  const [lowService, setLowService] = useState<number>(0);

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

        // Fetch services data
        const servicesResponse = await api.get<Services[]>(
          "/service/all-service"
        );
        const servicesData = servicesResponse.data;
        setServices(servicesData);

        console.log("Services Data:", servicesData); // Log toàn bộ dữ liệu dịch vụ để kiểm tra

        // Calculate topSelling based on the highest sales value in servicesData
        const maxPriceService = servicesData.reduce((max, service) => {
          return service.price > max ? service.price : max;
        }, 0);
        setTopSelling(maxPriceService);

        // Calculate lowService as the count of services with price < 100000
        const lowPriceServices = servicesData.filter(
          (service) => service.price < 100000
        );
        setLowService(lowPriceServices.length);

        // Fetch bookings data
        const bookingsResponse = await api.get<BookingData[]>(
          "/booking/all-booking"
        );
        const bookingsData = bookingsResponse.data;

        // Calculate total revenue from bookings
        const totalRev = bookingsData.reduce((total, booking) => {
          return total + booking.totalAmount;
        }, 0);
        setTotalRevenue(totalRev);
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
              name="High Price Services"
              icon={TrendingUp}
              value={topSelling.toLocaleString("vi-VN")}
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
