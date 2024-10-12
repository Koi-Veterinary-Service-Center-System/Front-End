import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    specialInstructions: "",
    vetNotes: "",
  });

  // Fetch appointments from the server
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/booking/view-booking-process", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update the status of an appointment
  const updateStatus = async (bookingID: string, newStatus: string) => {
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
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Determine if the button should be enabled based on date and time
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

  // Get the next status based on the current status
  const getNextStatus = (status: string) => {
    if (status === "Pending") return "On Going";
    if (status === "On Going") return "Completed";
    if (status === "Completed") return "Received Money";
    return status;
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prescription data:", prescriptionData);
    setOpen(false);
    // Implement the actual prescription creation logic here
  };

  // Handle input changes for the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPrescriptionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setPrescriptionData((prevData) => ({ ...prevData, [field]: value }));
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
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medication" className="text-right">
                              Medication
                            </Label>
                            <Input
                              id="medication"
                              name="medication"
                              value={prescriptionData.medication}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dosage" className="text-right">
                              Dosage
                            </Label>
                            <Input
                              id="dosage"
                              name="dosage"
                              value={prescriptionData.dosage}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">
                              Frequency
                            </Label>
                            <Select
                              onValueChange={handleSelectChange("frequency")}
                              defaultValue={prescriptionData.frequency}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="once">Once daily</SelectItem>
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
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                              Duration
                            </Label>
                            <Input
                              id="duration"
                              name="duration"
                              value={prescriptionData.duration}
                              onChange={handleInputChange}
                              className="col-span-3"
                              placeholder="e.g., 7 days"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="specialInstructions"
                              className="text-right"
                            >
                              Special Instructions
                            </Label>
                            <Textarea
                              id="specialInstructions"
                              name="specialInstructions"
                              value={prescriptionData.specialInstructions}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vetNotes" className="text-right">
                              Vet Notes
                            </Label>
                            <Textarea
                              id="vetNotes"
                              name="vetNotes"
                              value={prescriptionData.vetNotes}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save Prescription</Button>
                        </DialogFooter>
                      </form>
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
