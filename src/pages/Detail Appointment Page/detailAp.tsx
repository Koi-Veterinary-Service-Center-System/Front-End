import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Fish,
  Search,
  FileText,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/configs/axios";
import { Booking } from "@/types/info";

const prescriptionSchema = z.object({
  bookingID: z.string().optional(),
  diseaseName: z.string().min(1, "Disease name is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  medication: z.string().min(1, "Medication is required"),
  frequency: z.string().min(1, "Frequency is required"),
  note: z.string().optional(),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

export default function Component() {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      bookingID: "",
      diseaseName: "",
      symptoms: "",
      medication: "",
      frequency: "",
      note: "",
    },
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/booking/view-booking-process", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const appointmentsWithPrescriptions = await Promise.all(
        response.data.map(async (appointment: Booking) => {
          const bookingID = appointment.bookingID;
          if (!bookingID) {
            return { ...appointment, hasPrescription: false };
          }
          try {
            const prescription = await api.get(`/pres-rec/${bookingID}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            return { ...appointment, hasPrescription: !!prescription.data };
          } catch (error) {
            return { ...appointment, hasPrescription: false };
          }
        })
      );
      setAppointments(appointmentsWithPrescriptions);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async (bookingID: string) => {
    try {
      const response = await api.get(`/pres-rec/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const prescriptionData = response.data;
      form.reset(prescriptionData);
    } catch (error) {
      console.error("Failed to fetch prescription:", error);
      toast.error("Failed to load prescription data.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (bookingID: string, newStatus: string) => {
    let endpoint = "";

    if (newStatus === "On Going") {
      endpoint = `/booking/complete/${bookingID}`;
    } else if (newStatus === "Completed") {
      endpoint = `/booking/receive-money/${bookingID}`;
    } else {
      console.error("Invalid status:", newStatus);
      toast.error("Invalid status update.");
      return;
    }

    try {
      await api.patch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAppointments();
      toast.success(`Appointment status updated successfully to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update appointment status.");
    }
  };

  const handleAddPrescription = async (values: PrescriptionForm) => {
    try {
      await api.post("/pres-rec/create-presRec", values);
      setOpen(false);
      form.reset();
      toast.success("Prescription added successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to create prescription:", error);
      toast.error("Failed to create prescription.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-8">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-gray-800"
        >
          Veterinarian Appointments
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-full rounded-full shadow-md focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            />
          </div>
        </motion.div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <AnimatePresence>
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.bookingID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                    <CardTitle className="text-2xl font-bold">
                      Appointment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-3 rounded-lg"
                      >
                        <User className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Customer:
                          </span>
                          <p className="text-gray-900">
                            {appointment.customerName}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-green-50 p-3 rounded-lg"
                      >
                        <Fish className="mr-3 h-6 w-6 text-green-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Koi/Pool:
                          </span>
                          <p className="text-gray-900">
                            {appointment.koiOrPoolName}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-yellow-50 p-3 rounded-lg"
                      >
                        <Calendar className="mr-3 h-6 w-6 text-yellow-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Date:
                          </span>
                          <p className="text-gray-900">
                            {appointment.bookingDate}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-purple-50 p-3 rounded-lg"
                      >
                        <Clock className="mr-3 h-6 w-6 text-purple-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Time:
                          </span>
                          <p className="text-gray-900">{`${appointment.slotStartTime} - ${appointment.slotEndTime}`}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-red-50 p-3 rounded-lg"
                      >
                        <MapPin className="mr-3 h-6 w-6 text-red-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Location:
                          </span>
                          <p className="text-gray-900">
                            {appointment.location}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-indigo-50 p-3 rounded-lg"
                      >
                        <User className="mr-3 h-6 w-6 text-indigo-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Veterinarian:
                          </span>
                          <p className="text-gray-900">{appointment.vetName}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-pink-50 p-3 rounded-lg"
                      >
                        <PhoneCall className="mr-3 h-6 w-6 text-pink-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Phone:
                          </span>
                          <p className="text-gray-900">
                            {appointment.phoneNumber}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-orange-50 p-3 rounded-lg"
                      >
                        <span className="font-semibold text-gray-700 mr-2">
                          Service:
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-orange-200 text-orange-700"
                        >
                          {appointment.serviceName}
                        </Badge>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-teal-50 p-3 rounded-lg"
                      >
                        <span className="font-semibold text-gray-700 mr-2">
                          Status:
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-teal-200 text-teal-700"
                        >
                          {appointment.bookingStatus}
                        </Badge>
                      </motion.div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Dialog
                        open={
                          open && selectedBookingID === appointment.bookingID
                        }
                        onOpenChange={(isOpen) => {
                          setOpen(isOpen);
                          setSelectedBookingID(
                            isOpen ? appointment.bookingID : null
                          );
                          if (isOpen && appointment.hasPrescription) {
                            fetchPrescription(appointment.bookingID);
                          } else {
                            form.reset(); // Reset form cho trường hợp không có đơn thuốc
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="bg-green-500 hover:bg-green-600 transition-colors duration-300"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {appointment.hasPrescription
                              ? "View Prescription"
                              : "Create Prescription"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              {appointment.hasPrescription
                                ? "View/Edit Prescription"
                                : "Create Prescription"}
                            </DialogTitle>
                            <DialogDescription>
                              {appointment.hasPrescription
                                ? "View or edit the existing prescription."
                                : "Enter the details for the new prescription. Click save when you're done."}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(
                                handleAddPrescription
                              )}
                            >
                              <div className="grid gap-4 py-4">
                                <FormField
                                  control={form.control}
                                  name="bookingID"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Booking ID</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Booking ID"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="diseaseName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Disease Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Disease Name"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="symptoms"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Symptoms</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Symptoms"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="medication"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Medication</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Medication"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="frequency"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Frequency</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="once">
                                            Once daily
                                          </SelectItem>
                                          <SelectItem value="twice">
                                            Twice daily
                                          </SelectItem>
                                          <SelectItem value="thrice">
                                            Three times daily
                                          </SelectItem>
                                          <SelectItem value="asNeeded">
                                            As needed
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="note"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Note</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          placeholder="Special Instructions"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Prescription</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <div className="flex justify-end space-x-4 mt-0">
                        <Select
                          onValueChange={(value) =>
                            handleStatusChange(appointment.bookingID, value)
                          }
                          defaultValue={appointment.bookingStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="On Going">On Going</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Receive Money">
                              Receive Money
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
