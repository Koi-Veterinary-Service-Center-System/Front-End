import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import api from "@/configs/axios";
import Sidebar from "@/components/Sidebar/sidebar";
import HeaderAd from "@/components/common/header";
import { Toaster, toast } from "sonner";

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;
// Create a simple Modal component using Tailwind CSS
const Modal = ({ isOpen, closeModal, handleSubmit }) => {
  const [vetID, setVetID] = useState("");
  const [slotID, setSlotID] = useState("");

  if (!isOpen) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      <div className="bg-white p-6 rounded shadow-lg z-10">
        <h2 className="text-lg font-bold mb-4">Add Vet Slot</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(vetID, slotID);
            closeModal(); // Close the modal after submission
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="vetID"
            >
              Vet ID
            </label>
            <input
              type="text"
              id="vetID"
              value={vetID}
              onChange={(e) => setVetID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Enter Vet ID"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="slotID"
            >
              Slot ID
            </label>
            <input
              type="number"
              id="slotID"
              value={slotID}
              onChange={(e) => setSlotID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Enter Slot ID"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Slot
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Scheduler = () => {
  const scheduleObj = useRef(null);
  const [vetSlots, setVetSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch data from the API
  const fetchVetSlots = async () => {
    try {
      const response = await api.get(`/vetslot/vetslot-list`);
      const data = response.data;

      const events = data.map((slot) => ({
        Id: slot.slotID,
        Subject: `${slot.vetFirstName} ${slot.vetLastName}`,
        StartTime: new Date(`2024-01-10T${slot.slotStartTime}`),
        EndTime: new Date(`2024-01-10T${slot.slotEndTime}`),
        IsAllDay: false,
        Description: `Vet Name: ${slot.vetName}\nBooking Status: ${
          slot.isBook ? "❌ Booked" : "✅ Available"
        }`,
      }));

      setVetSlots(events);
    } catch (error) {
      console.error("Error fetching vet slots:", error);
    }
  };

  useEffect(() => {
    fetchVetSlots();
  }, []);

  // Handle add slot for the vet
  const addVetSlot = async (vetID, slotID) => {
    try {
      const values = { vetID, slotID };
      const response = await api.post(`/vetslot/add-vetslot`, values);
      console.log("Response: ", response.data);
      toast.success("Add vet to slot success");
      fetchVetSlots(); // Refresh the slots after adding one
    } catch (error) {
      console.error(
        "Error posting vet slot: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  const change = (args) => {
    if (scheduleObj.current) {
      scheduleObj.current.selectedDate = args.value;
      scheduleObj.current.dataBind();
    }
  };

  const onDragStart = (arg) => {
    arg.navigation.enable = true;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 " />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAd title="Schedules for Vet" />
        <motion.div
          className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Calendar</h1>
          <button
            className="bg-blue-500 text-white p-2 rounded mb-4"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            Add Slot for Vet
          </button>
          <ScheduleComponent
            height="650px"
            ref={scheduleObj}
            selectedDate={new Date(2024, 0, 10)}
            eventSettings={{ dataSource: vetSlots }}
            dragStart={onDragStart}
          >
            <ViewsDirective>
              {["Day", "Week", "WorkWeek", "Month", "Agenda"].map((item) => (
                <ViewDirective key={item} option={item} />
              ))}
            </ViewsDirective>
            <Inject
              services={[
                Day,
                Week,
                WorkWeek,
                Month,
                Agenda,
                Resize,
                DragAndDrop,
              ]}
            />
          </ScheduleComponent>
          <PropertyPane>
            <table style={{ width: "100%", background: "white" }}>
              <tbody>
                <tr style={{ height: "50px" }}>
                  <td style={{ width: "100%" }}>
                    <DatePickerComponent
                      value={new Date(2024, 0, 10)}
                      showClearButton={false}
                      placeholder="Current Date"
                      floatLabelType="Always"
                      change={change}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </PropertyPane>
        </motion.div>

        {/* Modal component */}
        <Modal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          handleSubmit={addVetSlot}
        />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Scheduler;
