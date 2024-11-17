import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import api from "@/configs/axios";
import { Booking } from "@/types/info";

interface GrowthData {
  month: string;
  Bookings: number;
}

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState<GrowthData[]>([]); // Specify type

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get("/booking/all-booking");
        const bookings = response.data;

        // Tạo đối tượng lưu số lượng booking theo từng tháng
        const monthlyData = Array(12).fill(0); // Khởi tạo mảng với 12 tháng

        // Duyệt qua mỗi booking và đếm số lượng booking cho mỗi tháng
        bookings.forEach((booking: Booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const month = bookingDate.getMonth(); // Lấy ra chỉ số của tháng (0=Jan, 1=Feb, ...)
          monthlyData[month] += 1; // Tăng số lượng booking cho tháng tương ứng
        });

        // Định dạng lại dữ liệu để phù hợp với biểu đồ
        const formattedData: GrowthData[] = [
          { month: "Jan", Bookings: monthlyData[0] },
          { month: "Feb", Bookings: monthlyData[1] },
          { month: "Mar", Bookings: monthlyData[2] },
          { month: "Apr", Bookings: monthlyData[3] },
          { month: "May", Bookings: monthlyData[4] },
          { month: "Jun", Bookings: monthlyData[5] },
          { month: "Jul", Bookings: monthlyData[6] },
          { month: "Aug", Bookings: monthlyData[7] },
          { month: "Sep", Bookings: monthlyData[8] },
          { month: "Oct", Bookings: monthlyData[9] },
          { month: "Nov", Bookings: monthlyData[10] },
          { month: "Dec", Bookings: monthlyData[11] },
        ];

        setUserGrowthData(formattedData); // Update state with formatted data
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        User Booking Per Month
      </h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "#93C5FD",
                color: "#1E40AF",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#1E40AF" }}
            />
            <Line
              type="monotone"
              dataKey="Bookings"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;
