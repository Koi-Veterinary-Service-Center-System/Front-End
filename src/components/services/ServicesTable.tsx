import api from "@/configs/axios";
import { Profile, Services } from "@/types/info";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  PlusCircle,
  Briefcase,
  FileText,
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/configs/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PiMoneyWavy } from "react-icons/pi";
import { Switch } from "../ui/switch";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Link } from "react-router-dom";

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
  quantityPrice: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, "Please input a valid quantity price!")
  ),
  isAtHome: z.boolean().default(false), // Boolean field with default false
  isOnline: z.boolean().default(false), // Boolean field with default false
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ServicesTable: React.FC<ServicesTableProps> = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Services[]>([]);
  const [filteredServices, setFilteredServices] = useState<Services[]>([]);
  const [currentService, setCurrentService] = useState<Services | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteServiceID, setDeleteServiceID] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string>("");

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      price: 0,
      estimatedDuration: 1,
      quantityPrice: 0,
      isAtHome: false,
      isOnline: false,
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

      // Filter out services where isDeleted is true
      const filteredResponse = response.data.filter(
        (service: Services) => !service.isDeleted
      );

      // Sort services by `id` in descending order to show latest first
      const sortedServices = filteredResponse.sort(
        (a: Services, b: Services) => b.serviceID - a.serviceID
      );

      setServices(sortedServices);
      setFilteredServices(sortedServices);
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
      quantityPrice: 0,
      isAtHome: false,
      isOnline: false,
    });
    setImageFile(null);
    setImageURL("");
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Services) => {
    setCurrentService(service);
    form.reset(service);
    setIsEditMode(true);
    setImageFile(null); // Reset the selected image file for edit
    setImageURL(service.imageURL || ""); // Set existing image URL if available
    setIsDialogOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageURL(URL.createObjectURL(e.target.files[0])); // Set preview URL
    }
  };

  // Upload file to Firebase and get URL
  // Upload file to Firebase and get URL
  const uploadFileToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `service_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", null, reject, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      });
    });
  };
  const handleSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      let uploadedImageUrl = imageURL;
      if (imageFile) {
        uploadedImageUrl = await uploadFileToFirebase(imageFile);
      }

      const payload = { ...data, imageURL: uploadedImageUrl };

      if (isEditMode) {
        await api.put(
          `/service/update-service/${currentService?.serviceID}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Service updated successfully!");
      } else {
        await api.post(`/service/add-service`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Service added successfully!");
      }

      setIsDialogOpen(false);
      form.reset();
      setImageFile(null);
      setImageURL("");
      fetchServices();
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
      await api.patch(`/service/soft-delete/${deleteServiceID}`, {
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
            className="bg-white text-gray-800 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-300"
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Estimated Duration</TableHead>
              {profile?.role === "Staff" && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.tr
                  key={service.serviceID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/detail-service/${service.serviceID}`}>
                    <TableCell>
                      <img
                        src={
                          service.imageURL ||
                          "https://kehlanpools.com/wp-content/uploads/2022/03/blg1.jpg"
                        }
                        alt={`${service.serviceName} image`}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </TableCell>
                  </Link>

                  <TableCell className="font-medium">
                    {service.serviceName}
                  </TableCell>
                  <TableCell>
                    {service.price.toLocaleString("vi-VN")} vnd
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {service.description.length > 50 ? (
                      <>
                        <span
                          data-tooltip-id="description-tooltip"
                          data-tooltip-content={service.description}
                          className="text-black cursor-pointer"
                        >
                          {service.description.slice(0, 50)}...
                        </span>
                      </>
                    ) : (
                      service.description
                    )}
                  </TableCell>
                  <TableCell>{service.estimatedDuration} hours</TableCell>
                  {profile?.role !== "Manager" && (
                    <TableCell className="text-right">
                      <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-blue-500 text-white hover:bg-blue-600 h-10 w-10 mr-2"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-red-500 text-white hover:bg-red-600 h-10 w-10"
                        onClick={() => confirmDelete(service.serviceID)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/src/assets/images/No-Messages-1--Streamline-Bruxelles.png"
                      alt="No Services"
                      className="w-32 h-32 object-contain mb-4"
                    />
                    <p className="text-muted-foreground">No services found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AnimatePresence>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-blue-200 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold flex items-center text-blue-800">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
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
                </motion.div>
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Image Upload Field */}
                <FormField
                  control={form.control}
                  name="imageURL"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-blue-700">
                        Upload Image
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {imageURL && (
                            <motion.img
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              src={imageURL}
                              alt="Service Preview"
                              className="h-24 w-24 rounded-lg object-cover border-2 border-blue-200"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">
                        Service Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                          <Input
                            placeholder="Enter service name"
                            {...field}
                            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                      <FormLabel className="text-blue-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                          <Textarea
                            placeholder="Enter service description"
                            {...field}
                            className="pl-10 min-h-[120px] border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                        <FormLabel className="text-blue-700">Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PiMoneyWavy className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                            <Input
                              type="number"
                              placeholder="Enter price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantityPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">
                          Quantity Price
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PiMoneyWavy className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                            <Input
                              type="number"
                              placeholder="Enter quantity price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                        <FormLabel className="text-blue-700">
                          Estimated Duration (hours)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                            <Input
                              type="number"
                              placeholder="Enter duration"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              step="0.1"
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
                      name="isAtHome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700">
                            At Home Service
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange} // Use `onCheckedChange` instead of `onChange`
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isOnline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700">
                            Online Service
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange} // Use `onCheckedChange` instead of `onChange`
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
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
      </AnimatePresence>

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
      <Tooltip
        id="description-tooltip"
        style={{
          maxWidth: "200px", // Đặt chiều rộng tối đa cho Tooltip
          whiteSpace: "normal", // Đảm bảo xuống hàng khi vượt quá chiều rộng
        }}
      />
    </motion.div>
  );
};

export default ServicesTable;
