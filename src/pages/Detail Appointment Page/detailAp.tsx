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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import api from "@/configs/axios";
import dayjs from "dayjs";
import { Booking } from "@/types/info";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Định nghĩa schema cho form
const prescriptionSchema = z.object({
  bookingID: z.string().optional(), // Add bookingID as optional
  diseaseName: z.string().min(1, "Disease name is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  medication: z.string().min(1, "Medication is required"),
  frequency: z.string().min(1, "Frequency is required"),
  note: z.string().optional(),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Khởi tạo form với react-hook-form và zod resolver
  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      bookingID: "", // Set initial value for bookingID if needed
      diseaseName: "",
      symptoms: "",
      medication: "",
      frequency: "",
      note: "",
    },
  });

  // Fetch appointments từ server
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/booking/view-booking-process", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const appointmentsWithPrescriptions = await Promise.all(
        response.data.map(async (appointment: Booking) => {
          console.log("Processing appointment:", appointment); // Log the entire appointment object
          const bookingID = appointment.bookingID;
          if (!bookingID) {
            console.warn("No bookingID found for appointment:", appointment);
            return { ...appointment, hasPrescription: false };
          }
          const prescription = await api.get(`/pres-rec/${bookingID}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return { ...appointment, hasPrescription: !!prescription.data };
        })
      );
      setAppointments(appointmentsWithPrescriptions);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cập nhật trạng thái cuộc hẹn
  const updateStatus = async (bookingID: string, newStatus: string) => {
    console.log(`Updating status for booking ID: ${bookingID} to ${newStatus}`);
    try {
      await api.put(
        `/booking/update-status`,
        { id: bookingID, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Status updated successfully");
      fetchAppointments(); // Refresh danh sách cuộc hẹn
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Kiểm tra nếu nút có thể bật
  const isButtonEnabled = (appointment: Booking) => {
    const now = dayjs();
    const appointmentDate = dayjs(appointment.bookingDate);
    const startTime = dayjs(appointment.slotStartTime, "HH:mm");
    const endTime = dayjs(appointment.slotEndTime, "HH:mm");

    return (
      appointmentDate.isSame(now, "day") &&
      now.isAfter(startTime) &&
      now.isBefore(endTime)
    );
  };

  // Lấy trạng thái tiếp theo dựa trên trạng thái hiện tại
  const getNextStatus = (status: string) => {
    if (status === "Pending") return "On Going";
    if (status === "On Going") return "Completed";
    if (status === "Completed") return "Received Money";
    return status;
  };

  // Lọc danh sách cuộc hẹn theo từ khóa
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý khi submit form
  const handleAddPrescription = async (values: PrescriptionForm) => {
    try {
      await api.post("/pres-rec/create-presRec", {
        ...values, // Cần thay đổi nếu bạn có giá trị bookingID cụ thể
      });
      setOpen(false);
      form.reset();
      toast.success("Add prescription successfully!");
    } catch (error) {
      console.error("Failed to create prescription:", error);
      toast.error("Failed to create prescription.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Veterinarian Appointments
        </h1>
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-full"
            />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.bookingID}
              className="bg-white/80 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Customer:</span>
                    {appointment.customerName}
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Phone:</span>
                    {appointment.phoneNumber}
                  </div>
                  <div className="flex items-center">
                    <Fish className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Koi/Pool:</span>
                    {appointment.koiOrPoolName}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Date:</span>
                    {appointment.bookingDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Time:</span>
                    {appointment.slotStartTime} - {appointment.slotEndTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Location:</span>
                    {appointment.location}
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold mr-2">Veterinarian:</span>
                    {appointment.vetName}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Service:</span>
                    <Badge variant="secondary">{appointment.serviceName}</Badge>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {appointment.bookingStatus}
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create Prescription</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new prescription. Click save
                          when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleAddPrescription)}
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
                                    <Input {...field} placeholder="Symptoms" />
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
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
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
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  className="bg-green-500 hover:bg-green-600"
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
                                    {/* Form Fields */}
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    variant="default"
                    size="sm"
                    onClick={() =>
                      updateStatus(
                        appointment.bookingID,
                        getNextStatus(appointment.bookingStatus)
                      )
                    }
                    disabled={!isButtonEnabled(appointment)}
                  >
                    {getNextStatus(appointment.bookingStatus)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
