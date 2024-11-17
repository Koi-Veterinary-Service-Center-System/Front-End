import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "@/configs/axios";
import { toast } from "sonner";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

// Define types for the chart data and booking data
interface ChartData {
  name: string;
  value: number;
}

interface Booking {
  bookingStatus: string;
}

const BookingStatusDemographicsChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get<Booking[]>("/booking/all-booking");
        const bookings = response.data;

        // Prepare data for the chart
        const statusCount = bookings.reduce<Record<string, number>>(
          (acc, booking) => {
            const status = booking.bookingStatus;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {}
        );

        const formattedChartData: ChartData[] = Object.keys(statusCount).map(
          (key) => ({
            name: key,
            value: statusCount[key],
          })
        );

        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to load booking data.");
      }
    };

    fetchBookingData();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Booking Status Distribution
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BookingStatusDemographicsChart;
