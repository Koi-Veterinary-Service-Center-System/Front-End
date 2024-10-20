import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Input, Form, Button, Select, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";

import Banner from "../../components/banner";
import api from "../../configs/axios";

import {
  Slot,
  Service,
  Vet,
  koiOrPool,
  Payment,
  Distance,
} from "../../types/info";
import { toast } from "sonner";
import { Fish, Waves } from "lucide-react";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { LuFish } from "react-icons/lu";
import { motion } from "framer-motion";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { ReactComponent as MedicineIcon } from "../../assets/images/undraw_medicine_b-1-ol.svg";

const { Option } = Select;

function Booking() {
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const bookingRef = useRef(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]); // To keep all slots
  const [services, setServices] = useState<Service[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [allVets, setAllVets] = useState<Vet[]>([]); // To keep all vets
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedVet, setSelectedVet] = useState<number | null>(null);

  const [isLoadingSlots, setLoadingSlots] = useState(false);
  const [isLoadingServices, setLoadingServices] = useState(false);
  const [isLoadingVets, setLoadingVets] = useState(false);
  const [isLoadingDistance, setLoadingDistance] = useState(false);
  const [koiAndPools, setKoiAndPools] = useState<koiOrPool[]>([]);
  const [isLoadingKoiAndPools, setLoadingKoiAndPools] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [isLoadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  // Ant Design form hook
  const [form] = Form.useForm();

  // Fetch Slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const response = await api.get("/slot/all-slot");
        setSlots(response.data); // Assuming response data is the array of slots
        setAllSlots(response.data); // Save all slots for filtering later
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
        setAllVets(response.data); // Save all vets for filtering later
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

  //Handle fetch fish or Pool
  useEffect(() => {
    const fetchKoiOrPools = async () => {
      try {
        setLoadingKoiAndPools(true);
        const response = await api.get("/koi-or-pool/all-customer-koi-pool");
        setKoiAndPools(response.data);
      } catch (error) {
        console.log("Error fetching koi and pools: ", error);

        // Kiểm tra nếu lỗi có chứa response và lấy message từ response body
        if (error.response && error.response.data) {
          toast.info(error.response.data); // Hiển thị message từ response body
        } else {
          toast.error("Failed to fetch Koi or Pools data"); // Hiển thị message mặc định nếu không có message từ API
        }
      } finally {
        setLoadingKoiAndPools(false);
      }
    };
    fetchKoiOrPools();
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
    setSelectedVet(vetId);

    // Find the selected vet's name
    const selectedVetName = vets.find((vet) => vet.id === vetId)?.vetName;

    // Set both vetId and vetName in the form fields
    form.setFieldsValue({ vet: vetId, vetName: selectedVetName });

    console.log("Selected Vet Name:", selectedVetName); // Debugging
  };

  // Calculate total example logic
  const calculateTotal = () => {
    const selectedService = services.find(
      (service) => service.serviceID === form.getFieldValue("serviceType")
    );
    if (selectedService) {
      const totalAmount = selectedService.price; // Adjust based on requirements
      setTotal(totalAmount);
    }
  };

  const handleBooking = async (values: any) => {
    try {
      // Format the date to YYYY-MM-DD according to the system's default timezone
      const bookingDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(values.pickupDate.toDate());

      // Retrieve selected district's information
      const selectedDistrict = distances.find(
        (distance) => distance.distanceID === values.district
      );

      // Combine user input location with selected district and area
      const fullLocation = `${values.location}, ${selectedDistrict?.district}, ${selectedDistrict?.area}`;

      const bookingData = {
        note: values.note || "",
        koiOrPoolId: values.koiOrPoolId || null,
        vetName: form.getFieldValue("vetName") || "",
        totalAmount: total,
        location: fullLocation, // Use the combined location here
        slotId: values.slot || 0,
        serviceId: values.serviceType || 0,
        paymentId: values.paymentMethod || 0,
        bookingDate: bookingDate,
      };

      console.log("Booking Data:", bookingData);

      const response = await api.post("/booking/create-booking", bookingData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking successful!");
      }
      navigate("/process");
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
      (service) => service.serviceID === form.getFieldValue("serviceType")
    );
    const selectedDistance = distances.find(
      (distance) => distance.distanceID === form.getFieldValue("district")
    );

    if (selectedService && selectedDistance) {
      const totalAmount = selectedService.price + selectedDistance.price; // Adjust based on requirements
      setTotal(totalAmount);
    } else if (selectedService) {
      setTotal(selectedService.price);
    } else {
      setTotal(0);
    }
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
                  name="pickupDate"
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
                  name="serviceType"
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
                        {service.serviceName} - ${service.price} (Duration:{" "}
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
                <Form.Item label="Slot" name="slot">
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
                        {distance.district} - {distance.area} (${distance.price}
                        )
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
                      <LuFish />
                      Choose Fish Or Pool
                    </span>
                  }
                  name="koiOrPoolId"
                >
                  <Select
                    className="w-full p-0"
                    style={{ height: "50px" }}
                    loading={isLoadingKoiAndPools}
                    placeholder="Select a fish or pool"
                  >
                    {/* Tùy chọn 'None' */}
                    <Option key="none" value={null}>
                      <div className="flex items-center gap-2">
                        <span>None</span> {/* Hiển thị văn bản 'None' */}
                      </div>
                    </Option>

                    {/* Các tùy chọn từ API */}
                    {koiAndPools.map((item) => (
                      <Option key={item.koiOrPoolID} value={item.koiOrPoolID}>
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.isPool ? (
                            <Waves className="text-cyan-400" />
                          ) : (
                            <Fish className="text-orange-500" />
                          )}
                        </div>
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
                name="paymentMethod"
                rules={[
                  { required: true, message: "Please select a payment method" },
                ]}
              >
                <Select
                  className="w-full p-0"
                  style={{ height: "50px" }}
                  loading={isLoadingPayment}
                  placeholder="Select payment method"
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
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Booking;
