import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Modal, Form, Select, TimePicker } from "antd";
import { format, addDays, startOfWeek, subWeeks, addWeeks } from "date-fns";
import api from "@/configs/axios";
import Sidebar from "@/components/Sidebar/sidebar";
import HeaderAd from "@/components/Header/headerAd";
import { toast } from "sonner";
import { Vet } from "@/types/info";
import dayjs from "dayjs";

interface Slot {
  id: string;
  day: string;
  task: string;
  vetId: string;
  startTime: Date;
  endTime: Date;
  weekDate: string;
}

export default function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vets, setVets] = useState<Vet[]>([]);
  const [currentSlot, setCurrentSlot] = useState<Slot | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [form] = Form.useForm();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  // Fetch vets and slots when component mounts
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

  const fetchSlots = async () => {
    try {
      const response = await api.get(`/vetslot/vetslot-list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const formattedSlots = response.data.map((slot: any) => ({
        id: slot.slotID.toString(),
        day: slot.weekDate,
        task: `${slot.vetFirstName} ${slot.vetLastName}`,
        vetId: slot.vetId,
        startTime: new Date(`1970-01-01T${slot.slotStartTime}`), // Chuyển đổi thành Date
        endTime: new Date(`1970-01-01T${slot.slotEndTime}`), // Chuyển đổi thành Date
      }));

      setSlots(formattedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots. Please try again.");
    }
  };

  useEffect(() => {
    fetchVet();
    fetchSlots();
  }, []);

  const handleAddSlot = async (values: any) => {
    const newSlotData = {
      vetID: values.vetId,
      slotID: parseInt(values.slotId),
      slotStartTime: format(values.startTime.toDate(), "HH:mm"),
      slotEndTime: format(values.endTime.toDate(), "HH:mm"),
    };

    try {
      const response = await api.post("/vetslot/add-vetslot", newSlotData, {
        headers: { "Content-Type": "application/json" },
      });
      setSlots([
        ...slots,
        {
          ...currentSlot,
          id: newSlotData.slotID.toString(),
        } as Slot,
      ]);
      setIsModalOpen(false);
      toast.success("Slot added successfully!");
      fetchSlots();
    } catch (error: any) {
      console.error(
        "Error adding new vet slot:",
        error.response?.data || error.message
      );
      toast.error("Failed to add slot. Please try again.");
    }
  };

  const handleDeleteSlot = async (vetId: string, slotId: string) => {
    try {
      await api.delete(`/vetslot/delete-vetslot/${vetId}/${slotId}`, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Deleted slot successfully!");
      fetchSlots();
      setSlots(slots.filter((slot) => slot.id !== slotId));
    } catch (error: any) {
      console.error(
        "Error deleting vet slot:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete slot. Please try again.");
    }
  };

  const handleUpdateSlot = async (values: any) => {
    const updatedSlot = {
      vetID: values.vetId,
      slotID: parseInt(values.slotId),
      slotStartTime: format(values.startTime.toDate(), "HH:mm"),
      slotEndTime: format(values.endTime.toDate(), "HH:mm"),
    };

    try {
      await api.put("/vetslot/update-vetslot", updatedSlot, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Updated slot successfully!");
      fetchSlots();
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === updatedSlot.slotID.toString()
            ? { ...slot, ...updatedSlot }
            : slot
        )
      );

      setIsModalOpen(false);
    } catch (error: any) {
      console.error(
        "Error updating vet slot:",
        error.response?.data || error.message
      );
      toast.error("Failed to update slot. Please try again.");
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleFormSubmit = (values: any) => {
    if (currentSlot?.id) {
      handleUpdateSlot(values);
    } else {
      handleAddSlot(values);
    }
  };

  const openModal = (slot?: Slot) => {
    setCurrentSlot(slot || null);
    if (slot) {
      form.setFieldsValue({
        vetId: slot.vetId,
        slotId: slot.id,
        startTime: dayjs(slot.startTime),
        endTime: dayjs(slot.endTime),
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-hidden">
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
              <Button onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous Week
              </Button>
              <Button onClick={handleNextWeek}>
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
              <div
                key={day.toISOString()}
                className="col-span-1 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gray-700 rounded-t-lg p-4">
                  <h3 className="text-center text-xl font-bold">
                    {format(day, "EEEE")}
                  </h3>
                  <p className="text-center text-sm text-gray-300">
                    {format(day, "MMM d")}
                  </p>
                </div>
                <div className="p-4">
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
                            <Button type="link" onClick={() => openModal(slot)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="link"
                              danger
                              onClick={() =>
                                handleDeleteSlot(slot.vetId, slot.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  <Button
                    type="dashed"
                    className="w-full mt-2"
                    onClick={() =>
                      openModal({
                        id: "",
                        day: format(day, "EEEE"),
                        task: "",
                        vetId: "",
                        startTime: new Date(),
                        endTime: new Date(),
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Slot
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <Modal
          title={currentSlot?.id ? "Edit Slot" : "Add Slot"}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            <Form.Item
              label="Vet"
              name="vetId"
              rules={[{ required: true, message: "Please select a vet" }]}
            >
              <Select placeholder="Select Vet">
                {vets.map((vet) => (
                  <Select.Option key={vet.id} value={vet.id}>
                    {vet.firstName} {vet.lastName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Available Slots"
              name="slotId"
              rules={[{ required: true, message: "Please select a slot" }]}
            >
              <Select placeholder="Select Slot">
                {slots.map((slot) => (
                  <Select.Option key={slot.id} value={slot.id}>
                    {slot.weekDate} - {format(slot.startTime, "HH:mm")} to{" "}
                    {format(slot.endTime, "HH:mm")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker use12Hours format="h:mm a" />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker use12Hours format="h:mm a" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
