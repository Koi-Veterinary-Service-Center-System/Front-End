import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Fish,
  Search,
  FileText,
  PhoneCall,
  Loader2,
  Home,
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
import { FaUserDoctor } from "react-icons/fa6";
import { RiServiceLine } from "react-icons/ri";
import { GiCirclingFish } from "react-icons/gi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import BookingRecord from "../booking/bookingRecord";

const prescriptionSchema = z.object({
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
  const [isOpenRecord, setOpenRecord] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState<string | null>(
    null
  );
  const [selectedPresRecID, setSelectedPresRecID] = useState<number | null>(
    null
  ); // Lưu presRecID để update đơn thuốc
  const [loading, setLoading] = useState(true);

  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
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
            return {
              ...appointment,
              hasPrescription: !!prescription.data,
              presRecID: prescription.data.id, // Lưu presRecID để sử dụng khi cần update
            };
          } catch (error: any) {
            return { ...appointment, hasPrescription: false };
          }
        })
      );
      setAppointments(appointmentsWithPrescriptions);
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error);
      toast.info(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async (bookingID: string, presRecID: number) => {
    try {
      const response = await api.get(`/pres-rec/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const prescriptionData = response.data;
      form.reset(prescriptionData);
      setSelectedPresRecID(presRecID); // Lưu presRecID khi load đơn thuốc
    } catch (error: any) {
      console.error("Failed to fetch prescription:", error);
      toast.info(error.response.data);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusOrder = ["On Going", "Completed", "Received_Money"]; // Thứ tự các trạng thái

  const handleStatusChange = async (
    bookingID: string,
    newStatus: string,
    currentStatus: string
  ) => {
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    const newStatusIndex = statusOrder.indexOf(newStatus);

    // Kiểm tra nếu trạng thái mới nằm trước trạng thái hiện tại (không cho phép)
    if (newStatusIndex <= currentStatusIndex) {
      toast.error("You cannot move to a previous status.");
      return;
    }

    let endpoint = "";

    if (newStatus === "On Going") {
      endpoint = `/booking/ongoing/${bookingID}`;
    } else if (newStatus === "Completed") {
      setSelectedBookingID(bookingID);
      setOpen(true); // Mở modal khi chọn On Going
    } else if (newStatus === "Received_Money") {
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
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error.response.data);
    }
  };

  const handleUpdatePrescription = async (values: PrescriptionForm) => {
    try {
      if (selectedPresRecID) {
        // Cập nhật đơn thuốc
        await api.put(`/pres-rec/update-presRec/${selectedPresRecID}`, {
          ...values,
        });
        toast.success("Prescription updated successfully!");
      } else {
        // Tạo mới đơn thuốc
        await api.post("/pres-rec/create-presRec", {
          ...values,
          bookingID: selectedBookingID,
        });
        toast.success("Prescription added successfully!");
      }

      setOpen(false);
      form.reset();
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update or create prescription:", error);
      toast.error("Failed to update or create prescription.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    setOpenRecord(false);
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white/70 text-blue-600 border-blue-300 hover:border-blue-400 transition-all duration-300"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-12 text-center text-white drop-shadow-lg"
        >
          Koi Veterinary Appointments
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full shadow-lg focus:ring-2 focus:ring-blue-300 transition-all duration-300 bg-white/90 backdrop-blur-sm"
            />
          </div>
        </motion.div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
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
                <Card className="bg-white/90 backdrop-blur-sm mb-6 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-400 text-white py-4">
                    <CardTitle className="text-2xl font-bold flex items-center">
                      <GiCirclingFish className="mr-2 h-6 w-6" />
                      Appointment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
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
                        className="flex items-center bg-teal-50 p-4 rounded-lg shadow"
                      >
                        <Fish className="mr-3 h-6 w-6 text-teal-500" />
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
                        className="flex items-center bg-yellow-50 p-4 rounded-lg shadow"
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
                        className="flex items-center bg-purple-50 p-4 rounded-lg shadow"
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
                        className="flex items-center bg-red-50 p-4 rounded-lg shadow"
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
                        className="flex items-center bg-indigo-50 p-4 rounded-lg shadow"
                      >
                        <FaUserDoctor className="mr-3 h-6 w-6 text-indigo-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Veterinarian:
                          </span>
                          <p className="text-gray-900">{appointment.vetName}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-pink-50 p-4 rounded-lg shadow"
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
                        className="flex items-center bg-orange-50 p-4 rounded-lg shadow"
                      >
                        <RiServiceLine className="mr-3 h-6 w-6 text-orange-700" />
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
                        className="flex items-center bg-green-50 p-4 rounded-lg shadow"
                      >
                        <HiOutlineStatusOnline className="mr-3 h-6 w-6 text-green-500" />
                        <span className="font-semibold text-gray-700 mr-2">
                          Status:
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-green-200 text-green-700"
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
                            fetchPrescription(
                              appointment.bookingID,
                              appointment.presRecID
                            );
                          } else {
                            form.reset();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
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
                                handleUpdatePrescription
                              )}
                            >
                              <div className="grid gap-4 py-4">
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
                                <Button
                                  type="submit"
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  {selectedPresRecID
                                    ? "Update Prescription"
                                    : "Save Prescription"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Select
                        onValueChange={(value) =>
                          handleStatusChange(
                            appointment.bookingID,
                            value,
                            appointment.bookingStatus
                          )
                        }
                        defaultValue={appointment.bookingStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On Going">On Going</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Received_Money">
                            Receive Money
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {/* Modal cho KoiVetBookingForm */}
            <Dialog open={isOpenRecord} onOpenChange={setOpenRecord}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Booking</DialogTitle>
                  <DialogDescription>
                    Please fill out the form to complete the booking.
                  </DialogDescription>
                </DialogHeader>
                {/* Truyền onClose để đóng modal sau khi booking hoàn thành */}
                <BookingRecord
                  bookingID={selectedBookingID}
                  onClose={handleCloseModal}
                />
              </DialogContent>
            </Dialog>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
