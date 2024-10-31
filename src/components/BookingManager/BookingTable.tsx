import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import api from "@/configs/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdAddBusiness } from "react-icons/md";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { RiSecurePaymentFill, RiSortNumberDesc } from "react-icons/ri";

import {
  Booking,
  Distance,
  Payment,
  services,
  Slot,
  User,
  Vet,
} from "@/types/info";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // Lưu trữ booking đã chọn để hiển thị chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false); // Điều khiển trạng thái của dialog
  const [users, setUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<services[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [vets, setVets] = useState<Vet[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const [isLoadingSlots, setLoadingSlots] = useState(false);
  const [isLoadingServices, setLoadingServices] = useState(false);
  const [isLoadingVets, setLoadingVets] = useState(false);
  const [isLoadingDistance, setLoadingDistance] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [isLoadingPayment, setLoadingPayment] = useState(false);

  const [form] = Form.useForm();

  // Fetch Slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const response = await api.get("/slot/all-slot");
        setSlots(response.data); // Assuming response data is the array of slots
        // setAllSlots(response.data); // Save all slots for filtering later
      } catch (error) {
        console.error("Error fetching slots:", error);
        toast.error("Failed to load slot data.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, []);

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await api.get("/service/all-service");
        setServices(response.data); // Assuming response data is the array of services
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load service data.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch all Vets
  useEffect(() => {
    const fetchAllVets = async () => {
      try {
        setLoadingVets(true);
        const response = await api.get("/vet/all-vet");
        setVets(response.data); // Set all vets initially
        // setAllVets(response.data); // Save all vets for filtering later
      } catch (error) {
        console.error("Error fetching all vets:", error);
        toast.error("Failed to load vet data.");
      } finally {
        setLoadingVets(false);
      }
    };

    fetchAllVets();
  }, []);

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        setLoadingDistance(true);
        const response = await api.get("/Distance/all-distance");
        setDistances(response.data);
      } catch (error) {
        console.error("Error fetching payments: ", error);
        toast.error("Failed to load payments.");
      } finally {
        setLoadingDistance(false);
      }
    };
    fetchDistance();
  }, []);

  //Fetch payment data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayment(true);
        const response = await api.get("/payment/all-payment");
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments: ", error);
        toast.error("Failed to load payments.");
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPayments();
  }, []); // Empty dependency array means this effect runs once when component mounts

  // Fetch available Vets for a selected slot
  const fetchVetsBySlot = async (slotId: number) => {
    try {
      setLoadingVets(true);
      const response = await api.get(`/vet/available-vet/${slotId}`);
      setVets(response.data); // Update the vets list based on the slot
    } catch (error) {
      console.error("Error fetching available vets:", error);
      toast.error("Failed to load vet data.");
    } finally {
      setLoadingVets(false);
    }
  };

  // Handle slot change to fetch vets
  const handleSlotChange = (slotId: number) => {
    setSelectedSlot(slotId);

    // Fetch new vets for the selected slot
    fetchVetsBySlot(slotId).then(() => {
      // If the previously selected vet is still available in the new slot, retain it
      const currentVetId = form.getFieldValue("vet");
      if (!vets.find((vet) => vet.id === currentVetId)) {
        form.setFieldsValue({ vet: undefined }); // Reset if the vet is not available for the new slot
      }
    });
  };

  // Handle vet change to fetch slot
  const handleVetChange = (vetId: number) => {
    // Find the selected vet's name
    const selectedVetName = vets.find((vet) => vet.id === vetId)?.vetName;

    // Set both vetId and vetName in the form fields
    form.setFieldsValue({ vet: vetId, vetName: selectedVetName });

    console.log("Selected Vet Name:", selectedVetName); // Debugging
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("User/all-user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error.message);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm fetch booking từ API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/booking/all-booking`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(response.data);
      setFilteredBookings(response.data); // Gán luôn danh sách booking ban đầu
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to fetch bookings.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chạy khi component được mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Hàm tìm kiếm booking
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = bookings.filter(
      (booking) =>
        booking.bookingID.toString().toLowerCase().includes(term) ||
        booking.customerName.toLowerCase().includes(term)
    );
    setFilteredBookings(filtered);
  };

  // Hàm mở dialog với chi tiết của booking đã chọn
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking); // Lưu thông tin booking đã chọn
    setIsDialogOpen(true); // Mở dialog
  };

  // Hàm đóng dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleBooking = async (values: Booking) => {
    try {
      // Format the date to YYYY-MM-DD according to the system's default timezone
      const bookingDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(values.bookingDate.toDate());

      // Retrieve selected district's information
      const selectedDistrict = distances.find(
        (distance) => distance.distanceID === values.district
      );

      // Combine user input location with selected district and area
      const fullLocation = `${values.location}, ${selectedDistrict?.district}, ${selectedDistrict?.area}`;

      const bookingData = {
        note: values.note || "",
        vetName: form.getFieldValue("vetName") || "",
        initAmount: total,
        location: fullLocation, // Use the combined location here
        slotID: values.slotID || 0,
        serviceId: values.serviceName || 0,
        paymentId: values.paymentType || 0,
        bookingDate: bookingDate,
        quantity: values.quantity,
      };

      console.log("Booking Data:", bookingData);

      const response = await api.post("/booking/create-booking", bookingData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking successful!");
      }
      window.location.href = "/process";
    } catch (error: any) {
      console.error("Booking error:", error);
      if (error.response && error.response.data) {
        toast.info(error.response.data); // Hiển thị message từ response body
      } else {
        toast.error("Failed to booking"); // Hiển thị message mặc định nếu không có message từ API
      }
    }
  };

  const calculateTota = () => {
    const selectedService = services.find(
      (service) => service.serviceID === form.getFieldValue("serviceName")
    );
    const selectedDistance = distances.find(
      (distance) => distance.distanceID === form.getFieldValue("district")
    );

    if (selectedService && selectedDistance) {
      const initAmount = selectedService.price + selectedDistance.price; // Tính tổng giá trị
      setTotal(initAmount);
    } else if (selectedService) {
      setTotal(selectedService.price);
    } else {
      setTotal(0);
    }
  };

  // Hàm xử lý mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset form sau khi đóng
  };
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Booking List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-white text-gray-800 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <Button
          type="primary"
          icon={<MdAddBusiness />}
          onClick={showModal}
          className="bg-blue-600 text-white mb-4"
        >
          Add Booking
        </Button>
        <Modal
          title="Add New Booking"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={null} // Loại bỏ các nút mặc định của Modal
        >
          <Form
            form={form}
            name="bookingForm"
            layout="vertical"
            onFinish={handleBooking}
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Customer Name - Select user từ danh sách */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label="Customer Name"
                  name="customerId"
                  rules={[
                    { required: true, message: "Please select a customer" },
                  ]}
                >
                  <Select showSearch placeholder="Select a customer">
                    {users.map((user) => (
                      <Select.Option key={user.userID} value={user.userID}>
                        {user.userName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label="Pickup Date"
                  name="bookingDate"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker className="w-full p-2 shadow-sm" />
                </Form.Item>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label={
                    <span className="flex items-center gap-2">
                      <MdOutlineMedicalServices />
                      Type of Services
                    </span>
                  }
                  name="serviceName"
                  rules={[
                    { required: true, message: "Please select a service" },
                  ]}
                >
                  <Select
                    className="w-full p-0"
                    style={{ height: "40px" }}
                    loading={isLoadingServices}
                    onChange={() => calculateTota()}
                  >
                    {services.map((service) => (
                      <Select.Option
                        key={service.serviceID}
                        value={service.serviceID}
                      >
                        {service.serviceName} - ${service.price} (Duration:{" "}
                        {service.estimatedDuration} hours)
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item label="Slot" name="slotID">
                  <Select
                    className="w-full p-0"
                    style={{ height: "50px" }}
                    loading={isLoadingSlots}
                    onChange={handleSlotChange}
                    value={selectedSlot}
                  >
                    {slots.map((slot) => (
                      <Select.Option key={slot.slotID} value={slot.slotID}>
                        {slot.weekDate} ({slot.startTime} - {slot.endTime})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaUserDoctor />
                      Veterinarian
                    </span>
                  }
                  name="vet" // Đảm bảo 'name' đúng
                  rules={[{ required: true, message: "Please select a vet" }]}
                >
                  <Select
                    className="w-full p-0"
                    style={{ height: "50px" }}
                    loading={isLoadingVets}
                    onChange={handleVetChange}
                    placeholder="Select a veterinarian"
                  >
                    <Select.Option key="none" value={null}>
                      <div className="flex items-center gap-2">
                        <span>None</span> {/* Hiển thị văn bản 'None' */}
                      </div>
                    </Select.Option>
                    {vets.map((vet) => (
                      <Select.Option key={vet.id} value={vet.id}>
                        {vet.vetName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Form.Item
                label="Location"
                name="location"
                rules={[
                  { required: true, message: "Please enter your location" },
                  {
                    pattern: /^[^\s].+$/,
                    message:
                      "Location cannot start with a space or contain special characters",
                  },
                ]}
              >
                <Input
                  className="w-full p-0"
                  style={{ height: "50px" }}
                  placeholder="Enter your location"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaLocationArrow />
                      Select a district
                    </span>
                  }
                  name="district"
                >
                  <Select
                    className="w-full p-0"
                    style={{ height: "50px" }}
                    loading={isLoadingDistance}
                    placeholder="Select a district"
                    onChange={() => calculateTota()}
                  >
                    {distances.map((distance) => (
                      <Select.Option
                        key={distance.distanceID}
                        value={distance.distanceID}
                      >
                        {distance.district} - {distance.area} ($
                        {distance.price})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label={
                    <span className="flex items-center gap-2">
                      <RiSortNumberDesc />
                      Quantity
                    </span>
                  }
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a quantity", // Bắt lỗi khi trường bị bỏ trống
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Quantity must be at least 1", // Bắt lỗi nếu người dùng nhập số nhỏ hơn 1
                    },
                  ]}
                >
                  <InputNumber min={1} className="w-full p-2 shadow-sm" />
                </Form.Item>
              </motion.div>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Form.Item
                label={
                  <span className="flex items-center gap-2">
                    <MdNoteAlt />
                    Note
                  </span>
                }
                name="note"
              >
                <TextArea className="w-full p-2 shadow-sm"></TextArea>
              </Form.Item>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Form.Item
                label={
                  <span className="flex items-center gap-2">
                    <RiSecurePaymentFill />
                    Payment Method
                  </span>
                }
                name="paymentType"
                rules={[
                  {
                    required: true,
                    message: "Please select a payment method",
                  },
                ]}
              >
                <Select
                  className="w-full p-0"
                  style={{ height: "50px" }}
                  loading={isLoadingPayment}
                  placeholder="Select payment method"
                >
                  {payments.map((item) => (
                    <Select.Option key={item.paymentID} value={item.paymentID}>
                      <div className="flex items-center gap-2">
                        <span>{item.type}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </motion.div>

            <motion.div
              className="text-xl font-semibold text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Total: {total.toLocaleString("vi-VN")} $</h3>{" "}
              {/* Định dạng số với dấu chấm phân tách hàng nghìn */}
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-500"
              >
                Book Now
              </Button>
            </motion.div>
          </Form>
        </Modal>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking.bookingID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {booking.bookingID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {booking.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {booking.totalAmount?.toLocaleString("vi-VN")} vnd
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.bookingStatus === "Succeeded"
                          ? "bg-green-100 text-green-800"
                          : booking.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-400"
                          : booking.bookingStatus === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : booking.bookingStatus === "Ongoing"
                          ? "bg-orange-100 text-orange-800"
                          : booking.bookingStatus === "Completed"
                          ? "bg-teal-100 text-teal-800"
                          : booking.bookingStatus === "Received_Money"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800" // Default màu đỏ cho các trạng thái khác
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.bookingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleViewDetails(booking)} // Khi bấm vào nút Eye sẽ mở dialog
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog hiển thị chi tiết booking */}
      {selectedBooking && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Booking ID:</strong> {selectedBooking.bookingID}
              </p>
              <p>
                <strong>Customer Name:</strong> {selectedBooking.customerName}
              </p>
              <p>
                <strong>Service:</strong> {selectedBooking.serviceNameAtBooking}
              </p>
              <p>
                <strong>Location:</strong> {selectedBooking.location}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedBooking.phoneNumber}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.bookingStatus}
              </p>
              <p>
                <strong>Booking Date:</strong> {selectedBooking.bookingDate}
              </p>
              <p>
                <strong>Payment Type:</strong>{" "}
                {selectedBooking.paymentTypeAtBooking}
              </p>
              <p>
                <strong>Slot:</strong> {selectedBooking.slotStartTimeAtBooking}{" "}
                - {selectedBooking.slotEndTimeAtBooking} (
                {selectedBooking.slotWeekDateAtBooking})
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};
export default OrdersTable;
