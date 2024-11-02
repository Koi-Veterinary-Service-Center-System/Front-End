import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import {
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
} from "antd";
import { useEffect, useRef, useState } from "react";
import api from "../../configs/axios";
import {
  Slot,
  Vet,
  Payment,
  Distance,
  Booking,
  Services,
} from "../../types/info";
import { toast } from "sonner";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { RiSortNumberDesc } from "react-icons/ri";
import { motion } from "framer-motion";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import TermsModal from "@/components/TermsModal/TermsModal";

const { Option } = Select;

function BookingPage() {
  const [total, setTotal] = useState(0);
  const bookingRef = useRef(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedVet, setSelectedVet] = useState<number | null>(null);

  const [isLoadingSlots, setLoadingSlots] = useState(false);
  const [isLoadingServices, setLoadingServices] = useState(false);
  const [isLoadingVets, setLoadingVets] = useState(false);
  const [isLoadingDistance, setLoadingDistance] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [isLoadingPayment, setLoadingPayment] = useState(false);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Ant Design form hook
  const [form] = Form.useForm();

  const handleDateChange = (date) => {
    if (!date) {
      setSlots(allSlots); // Khôi phục tất cả slots nếu không có ngày được chọn
      return;
    }

    const dayOfWeek = date.day();

    const filteredSlots = allSlots.filter((slot) => {
      const slotDay = moment(slot.weekDate, "dddd").day();
      return slotDay === dayOfWeek;
    });

    setSlots(filteredSlots);
  };
  // Fetch Slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const response = await api.get("/slot/all-slot");
        setSlots(response.data); // Hiển thị slots
        setAllSlots(response.data); // Lưu trữ slots ban đầu
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
  const fetchVetsBySlot = async (slotID: string) => {
    try {
      setLoadingVets(true);
      const response = await api.get(`/vet/available-vet/${slotID}`);
      setVets(response.data); // Update the vets list based on the slot
    } catch (error) {
      console.error("Error fetching available vets:", error);
      toast.error("Failed to load vet data.");
    } finally {
      setLoadingVets(false);
    }
  };

  // Handle slot change to fetch vets
  const handleSlotChange = (slotID: string) => {
    setSelectedSlot(slotID);

    // Fetch new vets for the selected slot
    fetchVetsBySlot(slotID).then(() => {
      // If the previously selected vet is still available in the new slot, retain it
      const currentVetId = form.getFieldValue("vet");
      if (!vets.find((vet) => vet.id === currentVetId)) {
        form.setFieldsValue({ vet: undefined }); // Reset if the vet is not available for the new slot
      }
    });
  };

  // Handle vet change to fetch slot
  const handleVetChange = (vetId: number) => {
    setSelectedVet(vetId);

    // Find the selected vet's name
    const selectedVetName = vets.find((vet) => vet.id === vetId)?.vetName;

    // Set both vetId and vetName in the form fields
    form.setFieldsValue({ vet: vetId, vetName: selectedVetName });

    console.log("Selected Vet Name:", selectedVetName); // Debugging
  };

  const handleBooking = async (values: Booking) => {
    try {
      // Format ngày đặt
      const bookingDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(values.bookingDate.toDate());

      // Lấy thông tin quận/huyện từ khoảng cách đã chọn
      const selectedDistrict = distances.find(
        (distance) => distance.distanceID === values.district
      );

      // Kết hợp thông tin vị trí
      const fullLocation = `${values.location}, ${selectedDistrict?.district}, ${selectedDistrict?.area}`;

      // Chuẩn bị dữ liệu booking
      const bookingData = {
        note: values.note || "",
        vetName: form.getFieldValue("vetName") || "",
        initAmount: total,
        location: fullLocation,
        slotID: values.slotID || 0,
        serviceId: values.serviceName || 0,
        paymentId: values.paymentType || 0, // Lấy paymentId dạng số
        bookingDate: bookingDate,
        quantity: values.quantity,
      };

      console.log("Booking Data:", bookingData);

      // Gọi API booking
      const response = await api.post("/booking/create-booking", bookingData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking successful!");

        // Kiểm tra nếu paymentId là 2 (tương ứng với VNPAY)
        if (values.paymentType === 2) {
          await handlePayOnline(response.data.bookingID); // Gọi API thanh toán
        } else {
          window.location.href = "/history"; // Chuyển về trang lịch sử nếu không phải VNPAY
        }
      }
    } catch (error: any) {
      console.error("Booking error:", error);

      if (error.response && error.response.data) {
        console.log("Server Error:", error.response.data);
        toast.info(JSON.stringify(error.response.data)); // Hiển thị lỗi chi tiết
      } else {
        toast.error("Failed to book the service.");
      }
    }
  };

  const handlePayOnline = async (bookingID: string) => {
    try {
      // Gọi API tạo URL thanh toán
      const response = await api.post(`/payment/create-paymentUrl`, null, {
        params: { bookingID },
      });

      if (response.status === 200 && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Điều hướng đến URL thanh toán
      } else {
        console.error("Failed to retrieve payment URL.");
        toast.error("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("An error occurred while initiating the payment.");
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

  const handleCheckboxChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  return (
    <div className="mt-5">
      <Header />
      <div ref={bookingRef} id="booking" className="bg-white py-12 px-6">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 mb-8 sm:mb-0"
        >
          <img
            src="src/assets/images/undraw_medicine_b-1-ol.svg"
            alt="Medicine Icon"
            className="w-32 h-32 mx-auto"
          />
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">Book a Service</h1>
          </motion.div>

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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Form.Item
                  label="Pickup Date"
                  name="bookingDate"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker
                    className="w-full p-2 shadow-sm"
                    disabledDate={(current) =>
                      current && current < moment().endOf("day")
                    }
                    onChange={handleDateChange} // Gọi hàm handleDateChange khi chọn ngày
                  />
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
                      <Option key={service.serviceID} value={service.serviceID}>
                        {service.serviceName} -{" "}
                        {service.price.toLocaleString("vi-VN")}vnd (Duration:{" "}
                        {service.estimatedDuration} hours)
                      </Option>
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
                      <Option key={slot.slotID} value={slot.slotID}>
                        {slot.weekDate} ({slot.startTime} - {slot.endTime})
                      </Option>
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
                  name="vet"
                >
                  <Select
                    className="w-full p-0"
                    style={{ height: "50px" }}
                    loading={isLoadingVets}
                    onChange={handleVetChange}
                    value={selectedVet}
                  >
                    <Option key="none" value={null}>
                      <div className="flex items-center gap-2">
                        <span>None</span> {/* Hiển thị văn bản 'None' */}
                      </div>
                    </Option>
                    {vets.map((vet) => (
                      <Option key={vet.id} value={vet.id}>
                        {vet.vetName}
                      </Option>
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
                      <Option
                        key={distance.distanceID}
                        value={distance.distanceID}
                      >
                        {distance.district} - {distance.area} (
                        {distance.price.toLocaleString("vi-VN")}vnd)
                      </Option>
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
                  { required: true, message: "Please select a payment method" },
                ]}
              >
                <Select
                  className="w-full p-0"
                  style={{ height: "50px" }}
                  loading={isLoadingPayment}
                  placeholder="Select payment method"
                  onChange={(value) => form.setFieldValue("paymentType", value)} // Lưu ID thay vì tên
                >
                  {payments.map((item) => (
                    <Option key={item.paymentID} value={item.paymentID}>
                      <div className="flex items-center gap-2">
                        <span>{item.type}</span>
                      </div>
                    </Option>
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
              <h3>Total: {total.toLocaleString("vi-VN")} vnd</h3>{" "}
              {/* Định dạng số với dấu chấm phân tách hàng nghìn */}
            </motion.div>

            {/* Terms and Conditions Section */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Checkbox onChange={handleCheckboxChange}>I accept the</Checkbox>
              <TermsModal />
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: isTermsAccepted ? 1.1 : 1 }}
              whileTap={{ scale: isTermsAccepted ? 0.9 : 1 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className={`bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md ${
                  isTermsAccepted
                    ? "hover:bg-blue-500"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isTermsAccepted} // Button only enabled if terms accepted
              >
                Book Now
              </Button>
            </motion.div>
          </Form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingPage;
