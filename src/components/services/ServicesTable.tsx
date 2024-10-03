import api from "@/configs/axios";
import { services } from "@/types/info";
import { Form, Modal } from "antd";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ServicesTableProps {
  onDeleteSuccess: () => void; // Add prop for delete success callback
  onAddSuccess: () => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  onDeleteSuccess,
  onAddSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<services[]>([]);
  const [filteredServices, setFilteredServices] = useState<services[]>([]);
  const [currentService, setCurrentService] = useState<services | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add Service modal
  const [error, setError] = useState<string | null>(null);

  // Search function
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = services.filter((service) =>
      service.serviceName.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const response = await api.get(`/service/all-service`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error: any) {
      console.error("Failed to fetch service data");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle edit service
  const handleEdit = (service: services) => {
    setCurrentService(service);
    form.setFieldsValue(service);
    setIsModalOpen(true);
  };

  // Handle update service
  const handleUpdateService = async (values: services) => {
    setLoading(true);
    try {
      await api.put(
        `/service/update-service/${currentService?.serviceID}`,
        values,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchServices();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete service
  const handleDelete = async (serviceID: number) => {
    setLoading(true);
    try {
      await api.delete(`/service/delete-service/${serviceID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDeleteSuccess(); // Call the delete success function passed from parent
      fetchServices(); // Refresh the list after deletion
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new service
  const handleAddService = async (values: services) => {
    setLoading(true);
    try {
      await api.post(`/service/add-service`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onAddSuccess();
      fetchServices(); // Refresh the list after adding a new service
      setIsAddModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error(
        "Add service failed:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

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
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        {/* Add Service button */}
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2" />
          Add Service
        </Button>
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
                  key={service.serviceID} // Ensure serviceID is used here
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
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(service.serviceID)} // Ensure correct ID is passed here
                    >
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

      {/* Modal for editing service */}
      <Modal
        title="Edit Service"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateService}>
          <Form.Item
            name="serviceName"
            label="Service Name"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input
              placeholder={currentService?.serviceName || "Enter service name"}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input
              placeholder={currentService?.description || "Enter description"}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input
              type="number"
              placeholder={currentService?.price?.toString() || "Enter price"}
            />
          </Form.Item>

          <Form.Item
            name="estimatedDuration"
            label="Estimated Duration (in hour)"
            rules={[
              {
                required: true,
                message: "Please input the estimated duration!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder={
                currentService?.estimatedDuration?.toString() ||
                "Enter estimated duration"
              }
            />
          </Form.Item>

          <Button variant="secondary" htmlType="submit" loading={loading}>
            Update Service
          </Button>
        </Form>
      </Modal>

      {/* Modal for adding a new service */}
      <Modal
        title="Add Service"
        visible={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddService}>
          <Form.Item
            name="serviceName"
            label="Service Name"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="estimatedDuration"
            label="Estimated Duration (in hour)"
            rules={[
              {
                required: true,
                message: "Please input the estimated duration!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter estimated duration" />
          </Form.Item>

          <Button variant="secondary" htmlType="submit" loading={loading}>
            Add Service
          </Button>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default ServicesTable;
