import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/configs/axios";
import axios from "axios";

interface FeedbackItem {
  serviceName: string;
  rate: number;
}

interface TransformedData {
  name: string;
  value: number;
}

// Màu sắc cho các phần của biểu đồ
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
];

const VetServiceChannelPerformance = () => {
  const [feedbackData, setFeedbackData] = useState<TransformedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch feedback data from API
  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Chuyển đổi dữ liệu thành định dạng mà biểu đồ có thể sử dụng
      const transformedData = response.data.reduce(
        (acc: TransformedData[], item: FeedbackItem) => {
          const label = `${item.serviceName} (Rate ${item.rate})`;
          const existingEntry = acc.find((entry) => entry.name === label);

          if (existingEntry) {
            existingEntry.value += 1; // Tăng số lượng feedback cho dịch vụ này và rate này
          } else {
            acc.push({ name: label, value: 1 });
          }

          return acc;
        },
        []
      );

      setFeedbackData(transformedData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data); // Set error message based on server response
      } else {
        console.error("An unknown error occurred:", error);
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Veterinary Service Performance by Rate
      </h2>

      {loading ? (
        <p className="text-blue-400">Loading...</p>
      ) : error ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/src/assets/images/No-Messages-1--Streamline-Bruxelles.png"
            alt="No Services"
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-muted-foreground">No data found</p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {feedbackData.map((_, index) => (
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
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default VetServiceChannelPerformance;
