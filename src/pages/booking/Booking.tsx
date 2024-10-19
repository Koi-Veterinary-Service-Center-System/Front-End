import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Waves,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Clipboard,
  User,
} from "lucide-react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast } from "sonner";
import api from "../../configs/axios";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import Banner from "../../components/banner";
import {
  Slot,
  Service,
  Vet,
  koiOrPool,
  Payment,
  Distance,
} from "../../types/info";

const { Option } = Select;

function Booking() {
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [koiAndPools, setKoiAndPools] = useState<koiOrPool[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedVet, setSelectedVet] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          slotsRes,
          servicesRes,
          vetsRes,
          distancesRes,
          koiPoolsRes,
          paymentsRes,
        ] = await Promise.all([
          api.get("/slot/all-slot"),
          api.get("/service/all-service"),
          api.get("/vet/all-vet"),
          api.get("/Distance/all-distance"),
          api.get("/koi-or-pool/all-customer-koi-pool"),
          api.get("/payment/all-payment"),
        ]);
        setSlots(slotsRes.data);
        setServices(servicesRes.data);
        setVets(vetsRes.data);
        setDistances(distancesRes.data);
        setKoiAndPools(koiPoolsRes.data);
        setPayments(paymentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleBooking = async (values: any) => {
    try {
      setLoading(true);
      const bookingDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(values.pickupDate.toDate());

      const selectedDistrict = distances.find(
        (distance) => distance.distanceID === values.district
      );

      const fullLocation = `${values.location}, ${selectedDistrict?.district}, ${selectedDistrict?.area}`;

      const bookingData = {
        note: values.note || "",
        koiOrPoolId: values.koiOrPoolId || null,
        vetName: form.getFieldValue("vetName") || "",
        totalAmount: total,
        location: fullLocation,
        slotId: values.slot || 0,
        serviceId: values.serviceType || 0,
        paymentId: values.paymentMethod || 0,
        bookingDate: bookingDate,
      };

      const response = await api.post("/booking/create-booking", bookingData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking successful!");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const selectedService = services.find(
      (service) => service.serviceID === form.getFieldValue("serviceType")
    );
    const selectedDistance = distances.find(
      (distance) => distance.distanceID === form.getFieldValue("district")
    );

    if (selectedService && selectedDistance) {
      const totalAmount = selectedService.price + selectedDistance.price;
      setTotal(totalAmount);
    } else if (selectedService) {
      setTotal(selectedService.price);
    } else {
      setTotal(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <Header />
      <Banner />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800">
              Koi Veterinary Service Booking
            </h1>
          </motion.div>

          <Form
            form={form}
            name="bookingForm"
            layout="vertical"
            onFinish={handleBooking}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
                <Form.Item
                  label={
                    <span className="flex items-center">
                      <Calendar className="mr-2" /> Pickup Date
                    </span>
                  }
                  name="pickupDate"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
                <Form.Item
                  label={
                    <span className="flex items-center">
                      <Clipboard className="mr-2" /> Type of Services
                    </span>
                  }
                  name="serviceType"
                  rules={[
                    { required: true, message: "Please select a service" },
                  ]}
                >
                  <Select onChange={calculateTotal}>
                    {services.map((service) => (
                      <Option key={service.serviceID} value={service.serviceID}>
                        {service.serviceName} - ${service.price} (Duration:{" "}
                        {service.estimatedDuration} hours)
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
                <Form.Item
                  label={
                    <span className="flex items-center">
                      <Clock className="mr-2" /> Slot
                    </span>
                  }
                  name="slot"
                >
                  <Select onChange={handleSlotChange} value={selectedSlot}>
                    {slots.map((slot) => (
                      <Option key={slot.slotID} value={slot.slotID}>
                        {slot.weekDate} ({slot.startTime} - {slot.endTime})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
                <Form.Item
                  label={
                    <span className="flex items-center">
                      <User className="mr-2" /> Veterinarian
                    </span>
                  }
                  name="vet"
                  rules={[{ required: true, message: "Please select a vet" }]}
                >
                  <Select onChange={handleVetChange} value={selectedVet}>
                    {vets.map((vet) => (
                      <Option key={vet.id} value={vet.id}>
                        {vet.vetName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <MapPin className="mr-2" /> Location
                  </span>
                }
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
                <Input placeholder="Enter your location" />
              </Form.Item>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <MapPin className="mr-2" /> Choose District
                  </span>
                }
                name="district"
              >
                <Select
                  placeholder="Select a district"
                  onChange={calculateTotal}
                >
                  {distances.map((distance) => (
                    <Option
                      key={distance.distanceID}
                      value={distance.distanceID}
                    >
                      {distance.district} - {distance.area} (${distance.price})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <Fish className="mr-2" /> Choose Fish or Pool
                  </span>
                }
                name="koiOrPoolId"
              >
                <Select placeholder="Select a fish or pool">
                  {koiAndPools.map((item) => (
                    <Option key={item.koiOrPoolID} value={item.koiOrPoolID}>
                      <div className="flex items-center">
                        {item.isPool ? (
                          <Waves className="mr-2 text-blue-500" />
                        ) : (
                          <Fish className="mr-2 text-orange-500" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
              <Form.Item label="Note" name="note">
                <TextArea
                  rows={4}
                  placeholder="Any additional information..."
                />
              </Form.Item>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <CreditCard className="mr-2" /> Payment Method
                  </span>
                }
                name="paymentMethod"
                rules={[
                  { required: true, message: "Please select a payment method" },
                ]}
              >
                <Select placeholder="Select payment method">
                  {payments.map((item) => (
                    <Option key={item.paymentID} value={item.paymentID}>
                      {item.type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-center text-blue-800 my-6"
            >
              Total: ${total}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="primary"
                htmlType="submit"
                className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                loading={loading}
              >
                Book Now
              </Button>
            </motion.div>
          </Form>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}

export default Booking;
