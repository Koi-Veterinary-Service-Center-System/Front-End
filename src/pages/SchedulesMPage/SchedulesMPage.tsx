"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek, subWeeks, addWeeks } from "date-fns";
import api from "@/configs/axios";
import Sidebar from "@/components/Sidebar/sidebar";
import HeaderAd from "@/components/common/header";
import { Toaster, toast } from "sonner";

interface Slot {
  id: string;
  day: string;
  task: string;
  vetId: string;
  startTime: string; // Added startTime field for slots
  endTime: string; // Added endTime field for slots
}

export default function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<Slot | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  useEffect(() => {
    async function fetchVetslots() {
      try {
        const response = await api.get("/vetslot/vetslot-list");
        const data = response.data;

        // Ensure vetId, startTime, and endTime are included in the slot object
        const formattedSlots = data.map((slot: any) => ({
          id: slot.slotID.toString(),
          day: slot.weekDate,
          task: `${slot.vetFirstName} ${slot.vetLastName}`,
          vetId: slot.vetID, // Ensure vetId is mapped correctly
          startTime: slot.slotStartTime || "09:00:00", // Provide default times if not present
          endTime: slot.slotEndTime || "10:00:00", // Provide default times if not present
        }));
        setSlots(formattedSlots);
      } catch (error) {
        console.error("Error fetching vet slots:", error);
      }
    }
    fetchVetslots();
  }, []);

  // Function to handle adding a new slot
  const handleAddSlot = async (newSlot: Omit<Slot, "id">) => {
    try {
      // Prepare the data for the POST request
      const vetId = newSlot.vetId; // Keep vetId from the form input

      const requestBody = {
        vetID: vetId,
        slotID: parseInt(newSlot.id), // Use user-provided slot ID
        slotStartTime: newSlot.startTime, // Send startTime
        slotEndTime: newSlot.endTime, // Send endTime
      };

      // Make the POST request to add a new vet slot
      const response = await api.post("/vetslot/add-vetslot", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("New Slot Added:", response.data);

      // Add the new slot to the local state after it’s successfully added
      setSlots([
        ...slots,
        { ...newSlot, id: requestBody.slotID.toString(), vetId }, // Store vetId in slot object
      ]);
    } catch (error) {
      console.error(
        "Error adding new vet slot:",
        error.response ? error.response.data : error.message
      );
    }

    setIsOpen(false);
  };

  const handleDeleteSlot = async (vetId: string, slotId: string) => {
    if (!vetId || !slotId) {
      console.error("vetId or slotId is missing!");
      return;
    }

    try {
      // Make the DELETE request to delete a vet slot using both vetId and slotId
      const response = await api.delete(
        `/vetslot/delete-vetslot/${vetId}/${slotId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response:", response);
      toast.success("Deleted slot successful!");
      // Remove the deleted slot from the local state
      setSlots(slots.filter((slot) => slot.id !== slotId));
      console.log(`Slot with ID ${slotId} deleted successfully.`);
    } catch (error) {
      console.error(
        "Error deleting vet slot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  //Handle edit shcedule for vet
  const handleUpdateSlot = async (updatedSlot: Slot) => {
    try {
      const requestBody = {
        vetID: updatedSlot.vetId,
        slotID: parseInt(updatedSlot.id), // Ensure slotID is sent as an integer
        isBook: true, // Assuming 'isBook' represents a booked slot
      };

      // Send the PUT request to update the slot
      const response = await api.put("/vetslot/update-vetslot", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Slot Updated:", response.data);
      toast.success("Updated slot successful!");
      // Update the local state with the updated slot information
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === updatedSlot.id ? updatedSlot : slot
        )
      );

      setIsOpen(false); // Close the dialog after the update
    } catch (error) {
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
                            {slot.task} - {slot.startTime} to {slot.endTime}{" "}
                            {/* Show start and end time */}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentSlot(slot); // Set the current slot for editing
                                setIsOpen(true); // Open the form modal
                              }}
                              className="text-gray-300 hover:text-gray-100"
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
                        startTime: "09:00:00", // Default start time
                        endTime: "10:00:00", // Default end time
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedSlot = {
                  id: formData.get("slotID") as string,
                  task: formData.get("vetId") as string,
                  day: currentSlot?.day || "",
                  vetId: formData.get("vetId") as string,
                  startTime: formData.get("startTime") as string, // Capture startTime input
                  endTime: formData.get("endTime") as string, // Capture endTime input
                };

                // If there's an existing slot (Edit), call the update function
                if (currentSlot?.id) {
                  handleUpdateSlot(updatedSlot);
                } else {
                  // Else, add a new slot
                  handleAddSlot(updatedSlot);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vetId" className="text-right text-gray-300">
                  Vet ID
                </Label>
                <Input
                  id="vetId"
                  name="vetId"
                  defaultValue={currentSlot?.vetId || ""}
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slotId" className="text-right text-gray-300">
                  Slot ID
                </Label>
                <Input
                  id="slotId"
                  name="slotID"
                  defaultValue={currentSlot?.id || ""}
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right text-gray-300">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  defaultValue={currentSlot?.startTime || "09:00"}
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right text-gray-300">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  defaultValue={currentSlot?.endTime || "10:00"}
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
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
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
