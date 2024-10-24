import api from "@/configs/axios";
import { Profile, services } from "@/types/info";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import ShimmerButton from "../ui/shimmer-button";

interface ServicesTableProps {
  onDeleteSuccess: () => void;
  onAddSuccess: () => void;
}

// Zod schema for form validation
const serviceSchema = z.object({
  serviceName: z.string().min(1, "Please input the service name!"),
  description: z.string().min(1, "Please input the description!"),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, "Please input a valid price!")
  ),
  estimatedDuration: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, "Please input a valid estimated duration!")
  ),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ServicesTable: React.FC<ServicesTableProps> = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<services[]>([]);
  const [filteredServices, setFilteredServices] = useState<services[]>([]);
  const [currentService, setCurrentService] = useState<services | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Để xác định chế độ
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteServiceID, setDeleteServiceID] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  // Setup react-hook-form with Zod schema validation
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      price: 0,
      estimatedDuration: 1,
    },
  });

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

  // Handle add service
  const handleAdd = () => {
    setIsEditMode(false); // Chế độ thêm mới
    form.reset({
      // Reset form về giá trị mặc định
      serviceName: "",
      description: "",
      price: 0,
      estimatedDuration: 1,
    });
    setIsDialogOpen(true);
  };

  // Handle edit service
  const handleEdit = (service: services) => {
    setCurrentService(service);
    form.reset(service);
    setIsEditMode(true); // Chế độ chỉnh sửa
    setIsDialogOpen(true);
  };

  // Handle update/add service based on mode
  const handleSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(
          `/service/update-service/${currentService?.serviceID}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Service updated successfully!");
      } else {
        await api.post(`/service/add-service`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Service added successfully!");
      }
      fetchServices();
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Operation failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (serviceID: number) => {
    setDeleteServiceID(serviceID);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete service
  const handleDelete = async () => {
    if (deleteServiceID === null) return;
    setLoading(true);
    try {
      await api.delete(`/service/delete-service/${deleteServiceID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchServices();
      setIsDeleteDialogOpen(false);
      setDeleteServiceID(null);
      toast.success("Service deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
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
        {profile?.role === "Staff" && (
          <ShimmerButton onClick={handleAdd}>
            <PlusCircle className="mr-2" />
            Add Service
          </ShimmerButton>
        )}
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
                      onClick={() => confirmDelete(service.serviceID)}
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

      {/* Unified Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              {isEditMode ? (
                <>
                  <Edit className="mr-2 h-6 w-6 text-primary" />
                  Edit Service
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-6 w-6 text-primary" />
                  Add New Service
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          placeholder="Enter service name"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Textarea
                          placeholder="Enter service description"
                          {...field}
                          className="pl-10 min-h-[100px]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="number"
                            placeholder="Enter price"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration (hours)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="number"
                            placeholder="Enter duration"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="pl-10"
                            step="0.1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Saving..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isEditMode ? "Save" : "Add"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this service?</p>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServicesTable;
