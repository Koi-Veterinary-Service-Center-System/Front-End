import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  FileText,
  PhoneCall,
  Loader2,
  Home,
  DollarSign,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/configs/axios";
import { Booking, Prescription } from "@/types/info";
import { FaUserDoctor } from "react-icons/fa6";
import { RiServiceLine } from "react-icons/ri";
import { GiCirclingFish } from "react-icons/gi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import BookingRecord from "../Booking/bookingRecord";
import BookingRecordModal from "../Booking/BookingRecordModal";
import ConfirmStatusChangeModal from "../Booking/ConfirmStatusChangeModal";
import { ViewPrescriptionDialog } from "./ViewPrescriptionDialog";
import { CreatePrescriptionDialog } from "./CreatePrescriptionDialog";
import { AxiosError } from "axios";

const prescriptionSchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  medication: z.string().min(1, "Medication is required"),
  frequency: z.string().min(1, "Frequency is required"),
  note: z.string().optional(),
  prescriptionRecordID: z.number().optional(),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

export default function Component() {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState<string | null>(
    null
  );
  const [isCreatePrescriptionOpen, setIsCreatePrescriptionOpen] =
    useState(false);
  const [isViewPrescriptionOpen, setIsViewPrescriptionOpen] = useState(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<
    PrescriptionForm[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [statusChangeBookingID, setStatusChangeBookingID] = useState<
    string | null
  >(null);

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
          } catch {
            return { ...appointment, hasPrescription: false };
          }
        })
      );
      setAppointments(appointmentsWithPrescriptions);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || "Failed to fetch appointments.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchPrescriptions = async (bookingID: string) => {
    try {
      const response = await api.get(`/pres-rec/${bookingID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", response); // Kiểm tra dữ liệu trả về

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from server.");
      }

      const prescriptionsData = response.data;

      if (Array.isArray(prescriptionsData) && prescriptionsData.length > 0) {
        // Sắp xếp dữ liệu theo ID giảm dần
        const sortedPrescriptions = prescriptionsData.sort(
          (a, b) =>
            (b.prescriptionRecordID || 0) - (a.prescriptionRecordID || 0)
        );

        // Chuẩn hóa dữ liệu trước khi set state
        const normalizedPrescriptions = sortedPrescriptions.map(
          (item: Prescription) => ({
            diseaseName: item.diseaseName || "",
            symptoms: item.symptoms || "",
            medicationDetails: item.medicationDetails || [],
            note: item.note || "",
            prescriptionRecordID: item.prescriptionRecordID,
            createAt: item.createAt || new Date().toISOString(), // Giá trị mặc định
          })
        );

        setSelectedPrescriptions(normalizedPrescriptions);
        setIsViewPrescriptionOpen(true);
      } else {
        toast.info("No prescription data available for this booking.");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || "Failed to fetch prescription.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const statusOrder = ["On Going", "Completed", "Received_Money"]; // Thứ tự các trạng thái

  const handleStatusChangeRequest = (
    bookingID: string,
    selectedStatus: string,
    currentStatus: string
  ) => {
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    const newStatusIndex = statusOrder.indexOf(selectedStatus);

    if (newStatusIndex <= currentStatusIndex) {
      toast.error("You cannot move to a previous status.");
      return;
    }

    // Open the confirmation dialog
    setStatusChangeBookingID(bookingID);
    setNewStatus(selectedStatus);
    setIsConfirmModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!statusChangeBookingID || !newStatus) return;

    let endpoint = "";
    if (newStatus === "On Going") {
      endpoint = `/booking/ongoing/${statusChangeBookingID}`;
    } else if (newStatus === "Completed") {
      setSelectedBookingID(statusChangeBookingID);
      setOpenBookingDialog(true);
      return;
    } else if (newStatus === "Received_Money") {
      endpoint = `/booking/receive-money/${statusChangeBookingID}`;
    } else {
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || "Failed to update status.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setStatusChangeBookingID(null);
      setNewStatus(null);
    }
  };

  const handleUpdatePrescription = async (data: any) => {
    console.log("Selected Booking ID:", selectedBookingID); // Kiểm tra bookingID trước khi gửi
    try {
      const formattedData = {
        ...data,
        bookingID: selectedBookingID, // Thêm bookingID vào payload
      };

      console.log("Formatted Data with Booking ID:", formattedData); // Kiểm tra dữ liệu đầy đủ

      await api.post("/pres-rec/create-presRec", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Prescription added successfully!");
      await fetchAppointments();
      // Đóng dialog Create Prescription
      setIsCreatePrescriptionOpen(false);
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Failed to save prescription.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    setOpenBookingDialog(false);
    fetchAppointments();
  };

  const openBookingRecordModal = (bookingID: string) => {
    setSelectedBookingID(bookingID);
    setIsRecordModalOpen(true);
  };

  const closeBookingRecordModal = () => {
    setIsRecordModalOpen(false);
    setSelectedBookingID(null);
  };

  const openCreatePrescriptionDialog = (bookingID: string) => {
    setSelectedBookingID(bookingID);
    setIsCreatePrescriptionOpen(true);
  };

  const openViewPrescriptionDialog = (bookingID: string) => {
    fetchPrescriptions(bookingID);
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
          className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500 drop-shadow-lg"
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
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 " />
            <Input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full shadow-lg focus:ring-2 focus:ring-blue-800 transition-all duration-300 bg-white/70 backdrop-blur-sm"
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
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <Calendar className="mr-3 h-6 w-6 text-blue-500" />
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
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <Clock className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Time:
                          </span>
                          <p className="text-gray-900">{`${appointment.slotStartTimeAtBooking} - ${appointment.slotEndTimeAtBooking}`}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <MapPin className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Location:
                          </span>
                          <p className="text-gray-900">
                            {appointment.location ===
                            "undefined, undefined, undefined"
                              ? "No location"
                              : appointment.location}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <FaUserDoctor className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Veterinarian:
                          </span>
                          <p className="text-gray-900">{appointment.vetName}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <PhoneCall className="mr-3 h-6 w-6 text-blue-500" />
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
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <RiServiceLine className="mr-3 h-6 w-6 text-blue-500" />
                        <span className="font-semibold text-gray-700 mr-2">
                          Service:
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          {appointment.serviceNameAtBooking}
                        </Badge>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <HiOutlineStatusOnline className="mr-3 h-6 w-6 text-blue-500" />
                        <span className="font-semibold text-gray-700 mr-2">
                          Status:
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700"
                        >
                          {appointment.bookingStatus}
                        </Badge>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <DollarSign className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Payment Status {appointment.paymentTypeAtBooking}
                          </span>
                          <p className="text-gray-900">
                            {appointment.isPaid ? (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="mr-1" /> Paid
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <XCircle className="mr-1" /> Unpaid
                              </span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <FileText className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Prescription:
                          </span>
                          <p className="text-gray-900">
                            {appointment.hasPres
                              ? "Available"
                              : "Not Available"}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <DollarSign className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Initial Amount:
                          </span>
                          <p className="text-gray-900">
                            {appointment.initAmount.toLocaleString()} VND
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center bg-blue-50 p-4 rounded-lg shadow"
                      >
                        <DollarSign className="mr-3 h-6 w-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700">
                            Total Amount:
                          </span>
                          <p className="text-gray-900">
                            {appointment.totalAmount
                              ? `${appointment.totalAmount.toLocaleString()} VND`
                              : "0 vnd"}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Dialog
                        open={selectedBookingID === appointment.bookingID}
                        onOpenChange={(isOpen) => {
                          setSelectedBookingID(
                            isOpen ? appointment.bookingID : null
                          );

                          form.reset();
                        }}
                      >
                        <Button
                          variant="default"
                          className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                          onClick={() =>
                            openBookingRecordModal(appointment.bookingID)
                          }
                        >
                          View Booking Record
                        </Button>

                        {selectedBookingID && (
                          <BookingRecordModal
                            bookingID={selectedBookingID}
                            isOpen={isRecordModalOpen}
                            onClose={closeBookingRecordModal}
                          />
                        )}
                      </Dialog>
                      {appointment.hasPres && (
                        <Button
                          variant="default"
                          className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                          onClick={() =>
                            openViewPrescriptionDialog(appointment.bookingID)
                          }
                        >
                          View Prescription
                        </Button>
                      )}
                      <Button
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
                        onClick={() =>
                          openCreatePrescriptionDialog(appointment.bookingID)
                        }
                      >
                        Create Prescription
                      </Button>
                      <Select
                        value={appointment.bookingStatus}
                        onValueChange={(value) =>
                          handleStatusChangeRequest(
                            appointment.bookingID,
                            value,
                            appointment.bookingStatus
                          )
                        }
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

                      <ConfirmStatusChangeModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onConfirm={handleStatusChange}
                        newStatus={newStatus || ""}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {/* Modal cho KoiVetBookingForm */}
            <Dialog
              open={openBookingDialog}
              onOpenChange={setOpenBookingDialog}
            >
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
            {/* Dialogs */}
            <CreatePrescriptionDialog
              isOpen={isCreatePrescriptionOpen}
              onClose={() => setIsCreatePrescriptionOpen(false)}
              onSubmit={(data) =>
                handleUpdatePrescription({
                  ...data,
                  bookingID: selectedBookingID,
                })
              }
            />

            <ViewPrescriptionDialog
              isOpen={isViewPrescriptionOpen}
              onClose={() => setIsViewPrescriptionOpen(false)}
              prescriptions={selectedPrescriptions} // Pass as array
            />
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
