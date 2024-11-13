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
import { Feedback } from "@/types/info";
import axios from "axios";

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
    fetchFeedback();
  }, []);

  // Chuyển đổi dữ liệu feedback thành dạng dùng cho biểu đồ
  const feedbackData = feedBacks.map((feedback: Feedback) => ({
    name: feedback.customerName,
    rate: feedback.rate,
  }));

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-blue-800 mb-4">FeedBack</h2>
      {loading ? (
        <p className="text-blue-100">Loading...</p>
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
            <LineChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
              <XAxis dataKey="name" stroke="#4B5563" />
              <YAxis stroke="#4B5563" domain={[0, 5]} />
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
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3B82F6"
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
