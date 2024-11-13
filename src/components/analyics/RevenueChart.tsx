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
import { Feedback } from "@/types/info";
import axios from "axios";

const FeedbackChart = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Feedback/all-feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const transformedData = response.data.map((item: Feedback) => ({
        serviceName: item.serviceName,
        rate: item.rate,
      }));

      setFeedbackData(transformedData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data); // Error message from server response
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
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">
          Feedback vs Service
        </h2>
      </div>

      {loading ? (
        <p className="text-blue-600">Loading...</p>
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
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
              <XAxis dataKey="serviceName" stroke="#4B5563" />
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
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#3B82F6"
                fill="url(#colorRate)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackChart;
