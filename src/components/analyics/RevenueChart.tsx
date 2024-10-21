import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/configs/axios";

const FeedbackChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Chuyển đổi dữ liệu từ API thành dạng dùng cho biểu đồ
      const transformedData = response.data.map((item: any) => ({
        name: item.customerName, // Giả sử dùng 'customerName' làm trục X
        rate: item.rate, // 'rate' làm dữ liệu hiển thị
        comments: item.comments, // Thêm vào cho phần tooltip nếu cần
      }));

      setFeedbackData(transformedData);
    } catch (error: any) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Feedback vs Service
        </h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-100">Loading...</p>
      ) : error ? (
        <p className="text-blue-500">{error}</p>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 5]} />{" "}
              {/* Giới hạn từ 0-5 cho rate */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackChart;
