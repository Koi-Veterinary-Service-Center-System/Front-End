import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import api from "@/configs/axios";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
];

const UserActivityHeatmap = () => {
  const [userActivityData, setUserActivityData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get("/booking/all-booking");
        const bookings = response.data;

        // Tạo cấu trúc dữ liệu với các khoảng thời gian cho từng ngày trong tuần
        const data = [
          {
            name: "Mon",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Tue",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Wed",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Thu",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Fri",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Sat",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
          {
            name: "Sun",
            "0-4": 0,
            "4-8": 0,
            "8-12": 0,
            "12-16": 0,
            "16-20": 0,
            "20-24": 0,
          },
        ];

        // Duyệt qua tất cả các booking và phân loại theo khoảng thời gian và ngày
        bookings.forEach((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const dayOfWeek = bookingDate.getDay(); // 0=Sunday, 1=Monday, ...
          const hour = bookingDate.getHours();

          let timeSlot;
          if (hour >= 0 && hour < 4) timeSlot = "0-4";
          else if (hour >= 4 && hour < 8) timeSlot = "4-8";
          else if (hour >= 8 && hour < 12) timeSlot = "8-12";
          else if (hour >= 12 && hour < 16) timeSlot = "12-16";
          else if (hour >= 16 && hour < 20) timeSlot = "16-20";
          else if (hour >= 20 && hour <= 24) timeSlot = "20-24";

          // Tăng số lượng booking trong khoảng thời gian và ngày tương ứng
          if (timeSlot) {
            const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday to the end of array
            data[dayIndex][timeSlot] += 1;
          }
        });

        setUserActivityData(data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        User Activity Heatmap
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            {["0-4", "4-8", "8-12", "12-16", "16-20", "20-24"].map(
              (timeSlot, index) => (
                <Bar
                  key={timeSlot}
                  dataKey={timeSlot}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;
