import { motion } from "framer-motion";
import { IconType } from "react-icons"; // Import kiểu cho các icon

interface StatCardProps {
  name: string;
  icon: IconType; // Định nghĩa kiểu cho icon
  value: string | number; // Kiểu dữ liệu cho value, có thể là string hoặc number
  color?: string; // Màu sắc là tùy chọn
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  icon: Icon,
  value,
  color,
}) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium text-gray-400">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
