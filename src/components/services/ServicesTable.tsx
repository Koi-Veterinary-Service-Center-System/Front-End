import api from "@/configs/axios";
import { Profile, services } from "@/types/info";
import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  PlusCircle,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteServiceID, setDeleteServiceID] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      price: 0,
      estimatedDuration: 1,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = services.filter((service) =>
      service.serviceName.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

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

  const handleAdd = () => {
    setIsEditMode(false);
    form.reset({
      serviceName: "",
      description: "",
      price: 0,
      estimatedDuration: 1,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: services) => {
    setCurrentService(service);
    form.reset(service);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

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

  const confirmDelete = (serviceID: number) => {
    setDeleteServiceID(serviceID);
    setIsDeleteDialogOpen(true);
  };

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
    <motion.div className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Service List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search service..."
            className="bg-white text-gray-800 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimate Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.tr
                  key={service.serviceID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex gap-2 items-center">
                    <img
                      src="https://kehlanpools.com/wp-content/uploads/2022/03/blg1.jpg"
                      alt="Service img"
                      className="size-10 rounded-full"
                    />
                    {service.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.estimatedDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => confirmDelete(service.serviceID)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <img
                      src="src/assets/images/No-Messages-1--Streamline-Bruxelles.png"
                      alt="No Messages"
                      className="object-contain w-1/2 h-1/2 max-w-xs max-h-64"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center text-blue-800">
              {isEditMode ? (
                <>
                  <Edit className="mr-2 h-6 w-6 text-blue-600" />
                  Edit Service
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
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
                          className="pl-10 border-gray-300"
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
                          className="pl-10 min-h-[100px] border-gray-300"
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
                            className="pl-10 border-gray-300"
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
                            className="pl-10 border-gray-300"
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white hover:bg-blue-700"
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this service?
          </p>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
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
