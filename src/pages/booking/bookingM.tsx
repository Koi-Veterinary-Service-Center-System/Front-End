import { CheckCircle, ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import HeaderAd from "@/components/Header/headerAd";
import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/Sidebar/sidebar";
import { useEffect, useState } from "react";
import { PiHandCoins } from "react-icons/pi";
import api from "../../configs/axios";
import { Booking } from "@/types/info";
import BookingTable from "@/components/BookingManager/BookingTable";
import BookingStatusDemographicsChart from "@/components/users/UserDemographicsChart";
import UserGrowthChart from "@/components/users/UserGrowthChart";

const BookMPage = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: "0",
    pendingOrders: "0",
    completedOrders: "0",
    ongoingOrders: "0",
    cancelledOrders: "0",
    totalRevenue: "0",
  });

  const fetchBookingData = async () => {
    try {
      const response = await api.get<Booking[]>(
        "http://localhost:5155/api/booking/all-booking"
      );
      const bookings = response.data;

      // Tính toán tổng số booking theo trạng thái
      const totalOrders = bookings.length;
      const pendingOrders = bookings.filter(
        (b: Booking) => b.bookingStatus === "Pending"
      ).length;
      const completedOrders = bookings.filter(
        (b: Booking) => b.bookingStatus === "Succeeded"
      ).length;
      const ongoingOrders = bookings.filter(
        (b: Booking) => b.bookingStatus === "Ongoing"
      ).length;
      const cancelledOrders = bookings.filter(
        (b: Booking) => b.bookingStatus === "Cancelled"
      ).length;

      // Tính tổng doanh thu
      const totalRevenue = bookings.reduce(
        (acc: number, b: Booking) => acc + b.totalAmount,
        0
      );

      setOrderStats({
        totalOrders: totalOrders.toString(),
        pendingOrders: pendingOrders.toString(),
        completedOrders: completedOrders.toString(),
        ongoingOrders: ongoingOrders.toString(),
        cancelledOrders: cancelledOrders.toString(),
        totalRevenue: `${totalRevenue.toLocaleString()}vnd`,
      });
    } catch (error) {
      console.error("Failed to fetch booking data", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-80 " />
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
              name="Cancelled Bookings"
              icon={X}
              value={orderStats.cancelledOrders}
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
              icon={PiHandCoins}
              value={orderStats.totalRevenue}
              color="#EF4444"
            />
          </motion.div>

          <BookingTable />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <BookingStatusDemographicsChart />
            <UserGrowthChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookMPage;
