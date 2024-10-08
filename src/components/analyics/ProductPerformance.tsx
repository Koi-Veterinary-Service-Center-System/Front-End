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

// Updated data for veterinary services for fish
const vetServiceData = [
  { name: "Health Check", appointments: 120, revenue: 3000, satisfaction: 4.8 },
  {
    name: "Water Quality Testing",
    appointments: 80,
    revenue: 2000,
    satisfaction: 4.5,
  },
  {
    name: "Parasite Treatment",
    appointments: 60,
    revenue: 1800,
    satisfaction: 4.7,
  },
  { name: "Injury Care", appointments: 50, revenue: 1500, satisfaction: 4.6 },
  {
    name: "Feeding Consultation",
    appointments: 40,
    revenue: 1000,
    satisfaction: 4.9,
  },
];

const FishVetServicePerformance = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-blue-100 mb-4">
        Fish Veterinary Services Performance
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={vetServiceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#BFDBFE" }}
            />
            <Legend />
            <Bar dataKey="appointments" fill="#38BDF8" name="Appointments" />
            <Bar dataKey="revenue" fill="#0EA5E9" name="Revenue" />
            <Bar dataKey="satisfaction" fill="#0284C7" name="Satisfaction" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default FishVetServicePerformance;
