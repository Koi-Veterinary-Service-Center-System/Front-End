import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/configs/axios";

const UserRetention = () => {
  const [feedBacks, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFeedBack(response.data);
    } catch (error: any) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Chuyển đổi dữ liệu feedback thành dạng dùng cho biểu đồ
  const feedbackData = feedBacks.map((feedback: any) => ({
    name: feedback.customerName,
    rate: feedback.rate,
  }));

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">FeedBack</h2>
      {loading ? (
        <p className="text-gray-100">Loading...</p>
      ) : error ? (
        <p className="text-blue-500">{error}</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default UserRetention;
