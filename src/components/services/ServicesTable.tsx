import api from "@/configs/axios";
import { services } from "@/types/info";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const ServicesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<services[]>([]); // Updated to array of services
  const [filteredServices, setFilteredServices] = useState<services[]>([]); // For search filtering
  const [error, setError] = useState<string | null>(null); // Ensure error message is a string

  // Search function
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = services.filter((service) =>
      service.serviceName.toLowerCase().includes(term)
    );

    setFilteredServices(filtered); // Set the filtered results
  };

  // Fetch the services
  const fetchServices = async () => {
    try {
      const response = await api.get(`/service/all-service`);
      setServices(response.data); // Store the fetched data
      setFilteredServices(response.data); // Initially, filtered data matches the full list
    } catch (error: any) {
      setError(error.message || "Failed to fetch service data!");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Service List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search service..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch} // Search functionality
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Estimate Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src="https://kehlanpools.com/wp-content/uploads/2022/03/blg1.jpg"
                      alt="Service img"
                      className="size-10 rounded-full"
                    />
                    {service.serviceName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.estimatedDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-400"
                >
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <div className="text-red-400 mt-4">{error}</div>}
    </motion.div>
  );
};

export default ServicesTable;
