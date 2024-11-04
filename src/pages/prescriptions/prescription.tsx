import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Search,
  Edit,
  Trash2,
  Pill,
  Stethoscope,
  Clock,
  FileText,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Booking, Prescription } from "@/types/info";
import api from "@/configs/axios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
// Define Zod schema
const prescriptionSchema = z.object({
  diseaseName: z.string().min(1, { message: "Disease name is required" }),
  symptoms: z.string().min(1, { message: "Symptoms are required" }),
  medication: z.string().min(1, { message: "Medication details are required" }),
  frequency: z.enum([
    "Once daily",
    "Twice daily",
    "Three times daily",
    "As needed",
  ]),
  note: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export default function FishPrescriptionSystem() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<
    number | null
  >(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);

  const fetchPrescriptions = async (customerName = "") => {
    try {
      const endpoint = `/pres-rec/list-preRec-CusName/${customerName}`;
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setPrescriptions(response.data);

        // Fetch booking details for each prescription
        response.data.forEach((prescription: Prescription) => {
          fetchBookingDetails(prescription.bookingID);
        });
      } else {
        toast.error("Failed to fetch prescriptions.");
      }
    } catch (error) {}
  };

  const fetchBookingDetails = async (bookingID: number) => {
    try {
      const response = await api.get(`/booking/view-booking/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setBookingDetails((prev) => ({
          ...prev,
          [bookingID]: response.data,
        }));
      } else {
        toast.error("Failed to fetch booking details.");
      }
    } catch (error) {
      toast.error("Failed to fetch booking details!");
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearch = () => {
    fetchPrescriptions(searchTerm);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
  });

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setValue("diseaseName", prescription.diseaseName);
    setValue("symptoms", prescription.symptoms);
    setValue("medication", prescription.medication);
    setValue("frequency", prescription.frequency);
    setValue("note", prescription.note || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: z.infer<typeof prescriptionSchema>) => {
    if (!editingPrescription) return;

    try {
      const response = await api.put(
        `/pres-rec/update-presRec/${editingPrescription.prescriptionRecordID}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Prescription updated successfully");
        fetchPrescriptions(searchTerm);
        setIsEditDialogOpen(false);
        setEditingPrescription(null);
      } else {
        toast.error("Failed to update prescription.");
      }
    } catch (error) {
      toast.error("Failed to update prescription!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/pres-rec/delete-presRec/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Prescription deleted successfully");
      fetchPrescriptions(searchTerm);
    } catch (error) {
      toast.error("Failed to delete prescription");
    }
    setIsDeleteDialogOpen(false);
    setPrescriptionToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold flex items-center">
                <Fish className="mr-2 h-8 w-8" /> Fish Prescription System
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">
                      New Prescription
                    </DialogTitle>
                  </DialogHeader>
                  {/* Add form fields for new prescription here */}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 flex items-center"
            >
              <Input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2 bg-white/50 backdrop-blur-sm"
              />
              <Button
                onClick={handleSearch}
                className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </motion.div>

            <AnimatePresence>
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription, index) => {
                  const booking = bookingDetails[prescription.bookingID];
                  return (
                    <motion.div
                      key={prescription.prescriptionRecordID}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="mb-6 overflow-hidden bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="bg-gradient-to-r from-blue-100 to-teal-100 p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl text-blue-700 flex items-center">
                              <Stethoscope className="h-6 w-6 mr-2" />
                              Prescription Details
                            </CardTitle>
                            <Badge variant="secondary" className="text-sm">
                              ID: {prescription.prescriptionRecordID}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(prescription)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">
                                  Edit prescription
                                </span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setPrescriptionToDelete(
                                    prescription.prescriptionRecordID
                                  );
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  Delete prescription
                                </span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          >
                            <InfoItem
                              icon={AlertCircle}
                              label="Disease"
                              value={prescription.diseaseName}
                            />
                            <InfoItem
                              icon={Pill}
                              label="Medication"
                              value={prescription.medication}
                            />
                            <InfoItem
                              icon={Clock}
                              label="Frequency"
                              value={prescription.frequency}
                            />
                            <InfoItem
                              icon={Calendar}
                              label="Created At"
                              value={new Date(
                                prescription.createAt
                              ).toLocaleString()}
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 space-y-4"
                          >
                            <InfoItem
                              icon={FileText}
                              label="Symptoms"
                              value={prescription.symptoms}
                              fullWidth
                            />
                            <InfoItem
                              icon={FileText}
                              label="Note"
                              value={prescription.note}
                              fullWidth
                            />
                          </motion.div>
                          {booking && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="mt-6 bg-blue-50 p-4 rounded-lg"
                            >
                              <h4 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                                <User className="h-5 w-5 mr-2" /> Booking
                                Information
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                  label="Booking Date"
                                  value={booking.bookingDate}
                                />
                                <InfoItem
                                  label="Service"
                                  value={booking.serviceNameAtBooking}
                                />
                                <InfoItem
                                  label="Quantity"
                                  value={booking.quantity.toString()}
                                />
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-600"
                >
                  No prescriptions found.
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Prescription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-blue-50 to-teal-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">
              Edit Prescription
            </DialogTitle>
          </DialogHeader>
          {editingPrescription && (
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diseaseName" className="text-blue-700">
                  <Stethoscope className="inline-block mr-2 h-4 w-4" />
                  Disease Name
                </Label>
                <Input
                  id="diseaseName"
                  {...register("diseaseName")}
                  className="bg-white/50 backdrop-blur-sm"
                />
                {errors.diseaseName && (
                  <p className="text-red-500">{errors.diseaseName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-blue-700">
                  <AlertCircle className="inline-block mr-2 h-4 w-4" />
                  Symptoms
                </Label>
                <Input
                  id="symptoms"
                  {...register("symptoms")}
                  className="bg-white/50 backdrop-blur-sm"
                />
                {errors.symptoms && (
                  <p className="text-red-500">{errors.symptoms.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication" className="text-blue-700">
                  <Pill className="inline-block mr-2 h-4 w-4" />
                  Medication
                </Label>
                <Textarea
                  id="medication"
                  {...register("medication")}
                  className="bg-white/50 backdrop-blur-sm"
                />
                {errors.medication && (
                  <p className="text-red-500">{errors.medication.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-blue-700">
                  <Clock className="inline-block mr-2 h-4 w-4" />
                  Frequency
                </Label>
                <select
                  id="frequency"
                  {...register("frequency")}
                  className="bg-white/50 backdrop-blur-sm p-2 rounded"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                </select>
                {errors.frequency && (
                  <p className="text-red-500">{errors.frequency.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="note" className="text-blue-700">
                  <FileText className="inline-block mr-2 h-4 w-4" />
                  Note
                </Label>
                <Textarea
                  id="note"
                  {...register("note")}
                  className="bg-white/50 backdrop-blur-sm"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prescription? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                prescriptionToDelete && handleDelete(prescriptionToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface InfoItemProps {
  icon?: React.ElementType;
  label: string;
  value: string;
  fullWidth?: boolean;
}

function InfoItem({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: InfoItemProps) {
  return (
    <div className={`flex items-start ${fullWidth ? "col-span-full" : ""}`}>
      {Icon && (
        <Icon className="h-5 w-5 mr-2 text-blue-500 mt-1 flex-shrink-0" />
      )}
      <div>
        <p className="font-semibold text-blue-700">{label}</p>
        <p className="text-gray-700">{value}</p>
      </div>
    </div>
  );
}
