import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

const overviewData = [
  { name: "Revenue", value: "$1,234", change: 2.5, icon: DollarSign },
  { name: "Users", value: "2", change: 0.2, icon: Users },
  { name: "Bookings", value: "6", change: -3.2, icon: ShoppingBag },
  { name: "Page Views", value: "10", change: 2, icon: Eye },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gradient-to-br from-blue-50 to-white shadow-lg
            rounded-xl p-6 border border-blue-200
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-600">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-blue-900">
                {item.value}
              </p>
            </div>

            <div
              className={`
              p-3 rounded-full ${
                item.change >= 0 ? "bg-green-100" : "bg-red-100"
              }
              `}
            >
              <item.icon
                className={`size-6  ${
                  item.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
          <div
            className={`
              mt-4 flex items-center ${
                item.change >= 0 ? "text-green-600" : "text-red-600"
              }
            `}
          >
            {item.change >= 0 ? (
              <ArrowUpRight size="20" />
            ) : (
              <ArrowDownRight size="20" />
            )}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(item.change)}%
            </span>
            <span className="ml-2 text-sm text-gray-600">vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
