import { motion } from "framer-motion";

interface StatCardProps {
  name: string;
  icon: React.ElementType; // Use React.ElementType for flexibility
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  icon: Icon,
  value,
  color,
}) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-100 to-white border-b border-blue-200 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-semibold text-blue-700">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-blue-700">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
