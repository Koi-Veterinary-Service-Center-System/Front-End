import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, addDays, startOfWeek, subWeeks, addWeeks } from "date-fns";
import api from "@/configs/axios";
import Sidebar from "@/components/Sidebar/sidebar";
import HeaderAd from "@/components/common/header";
import { toast } from "sonner";
import { Vet } from "@/types/info";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS cho date-picker

interface Slot {
  id: string;
  day: string;
  task: string;
  vetId: string;
  startTime: Date; // Thay đổi kiểu dữ liệu startTime thành Date
  endTime: Date; // Thay đổi kiểu dữ liệu endTime thành Date
  weekDate: string;
}

export default function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [vets, setVets] = useState<Vet[]>([]);
  const [currentSlot, setCurrentSlot] = useState<Slot | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const fetchVet = async () => {
    try {
      const response = await api.get(`/vet/all-vet`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVets(response.data);
    } catch (error) {
      console.error("Error fetching vets:", error);
      toast.error("Failed to fetch vets. Please try again.");
    }
  };

  const fetchSlot = async () => {
    try {
      const response = await api.get(`slot/all-slot`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots. Please try again.");
    }
  };

  useEffect(() => {
    fetchVet();
    fetchSlot();
  }, []);

  useEffect(() => {
    async function fetchVetslots() {
      try {
        const response = await api.get("/vetslot/vetslot-list");
        const data = response.data;

        const formattedSlots = data.map((slot: any) => ({
          id: slot.slotID.toString(),
          day: slot.weekDate,
          task: `${slot.vetFirstName} ${slot.vetLastName}`,
          vetId: slot.vetID,
          startTime: slot.slotStartTime ? new Date(slot.slotStartTime) : null,
          endTime: slot.slotEndTime ? new Date(slot.slotEndTime) : null, // Chuyển thành Date object
        }));
        setSlots(formattedSlots);
      } catch (error) {
        console.error("Error fetching vet slots:", error);
      }
    }
    fetchVetslots();
  }, []);

  const handleAddSlot = async () => {
    if (!currentSlot?.vetId || !currentSlot?.id) {
      toast.error("Please select a Vet and a Slot ID.");
      return;
    }

    const newSlotData = {
      vetID: currentSlot.vetId,
      slotID: parseInt(currentSlot.id),
      slotStartTime: format(currentSlot.startTime, "HH:mm"), // Format lại cho đúng
      slotEndTime: format(currentSlot.endTime, "HH:mm"), // Format lại cho đúng
    };

    try {
      const response = await api.post("/vetslot/add-vetslot", newSlotData, {
        headers: { "Content-Type": "application/json" },
      });
      setSlots([
        ...slots,
        { ...currentSlot, id: newSlotData.slotID.toString() },
      ]);
      setIsOpen(false);
    } catch (error: any) {
      console.error(
        "Error adding new vet slot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteSlot = async (vetId: string, slotId: string) => {
    try {
      const response = await api.delete(
        `/vetslot/delete-vetslot/${vetId}/${slotId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Deleted slot successful!");
      setSlots(slots.filter((slot) => slot.id !== slotId));
    } catch (error: any) {
      console.error(
        "Error deleting vet slot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleUpdateSlot = async (updatedSlot: Slot) => {
    try {
      const requestBody = {
        vetID: updatedSlot.vetId,
        slotID: parseInt(updatedSlot.id),
        isBook: true,
      };

      const response = await api.put("/vetslot/update-vetslot", requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Updated slot successful!");
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === updatedSlot.id ? updatedSlot : slot
        )
      );

      setIsOpen(false);
    } catch (error: any) {
      console.error(
        "Error updating vet slot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const onFinish = (values: any) => {
    if (currentSlot?.id) {
      handleUpdateSlot({ ...currentSlot, ...values });
    } else {
      handleAddSlot({ ...values, id: values.slotId });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Schedules Assigned for Vets" />
        <div className="p-6">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-100">
              Weekly Schedule
            </h2>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous Week
              </Button>
              <Button variant="secondary" onClick={handleNextWeek}>
                Next Week <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {weekDays.map((day) => (
              <Card
                key={day.toISOString()}
                className="col-span-1 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-center text-xl font-bold">
                    {format(day, "EEEE")}
                  </CardTitle>
                  <p className="text-center text-sm text-gray-300">
                    {format(day, "MMM d")}
                  </p>
                </CardHeader>
                <CardContent className="pt-4">
                  {slots
                    .filter((slot) => slot.day === format(day, "EEEE"))
                    .map((slot) => (
                      <div
                        key={`${slot.id}-${format(day, "yyyy-MM-dd")}`}
                        className="mb-3 p-3 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-100">
                            {slot.task} - {format(slot.startTime, "HH:mm")} to{" "}
                            {format(slot.endTime, "HH:mm")}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentSlot(slot);
                                setIsOpen(true);
                              }}
                              className="text-gray-300 hover:text-black-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteSlot(slot.vetId, slot.id)
                              }
                              className="text-gray-300 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-gray-100"
                    onClick={() => {
                      setCurrentSlot({
                        id: "",
                        day: format(day, "EEEE"),
                        task: "",
                        vetId: "",
                        startTime: new Date(), // Khởi tạo thời gian mặc định
                        endTime: new Date(), // Khởi tạo thời gian mặc định
                      });
                      setIsOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Slot
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {currentSlot?.id ? "Edit Slot" : "Add New Slot"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {currentSlot?.id
                  ? "Edit the details of the slot."
                  : "Add a new slot to the schedule."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onFinish} className="space-y-4">
              <div>
                <label>Vet</label>
                <select
                  className="bg-gray-700 border-gray-600 text-gray-100 w-full p-2"
                  value={currentSlot?.vetId || ""}
                  onChange={(e) =>
                    setCurrentSlot({ ...currentSlot, vetId: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Vet
                  </option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.firstName} {vet.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Available Slots</label>
                <select
                  className="bg-gray-700 border-gray-600 text-gray-100 w-full p-2"
                  value={currentSlot?.id || ""}
                  onChange={(e) =>
                    setCurrentSlot({
                      ...currentSlot,
                      id: e.target.value,
                      startTime:
                        slots.find((slot) => slot.id === e.target.value)
                          ?.startTime || new Date(),
                      endTime:
                        slots.find((slot) => slot.id === e.target.value)
                          ?.endTime || new Date(),
                    })
                  }
                >
                  <option value="" disabled>
                    Select Slot
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {format(slot.startTime, "HH:mm")} -{" "}
                      {format(slot.endTime, "HH:mm")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Start Time</label>
                <DatePicker
                  selected={currentSlot?.startTime}
                  onChange={(date) =>
                    setCurrentSlot({ ...currentSlot, startTime: date! })
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Start Time"
                  dateFormat="h:mm aa"
                  className="bg-gray-700 border-gray-600 text-gray-100 w-full p-2"
                />
              </div>

              <div>
                <label>End Time</label>
                <DatePicker
                  selected={currentSlot?.endTime}
                  onChange={(date) =>
                    setCurrentSlot({ ...currentSlot, endTime: date! })
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="End Time"
                  dateFormat="h:mm aa"
                  className="bg-gray-700 border-gray-600 text-gray-100 w-full p-2"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentSlot?.id ? "Save Changes" : "Add Slot"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
