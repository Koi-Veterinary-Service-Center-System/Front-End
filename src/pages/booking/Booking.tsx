import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Input, Form, Button, Select, DatePicker, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../../components/banner";
import api from "../../configs/axios";
import moment from "moment";
import { Slot, Service, Vet } from "../../types/info";
import { Toaster, toast } from "sonner";

const { Option } = Select;

function Booking() {
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const location = useLocation();
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

  // Fetch available slots for a selected vet
  const fetchSlotsByVet = async (vetId: number) => {
    try {
      setLoadingSlots(true);
      const response = await api.get(`/vet/available-slot/${vetId}`);
      setSlots(response.data); // Update the slot list based on the vet
    } catch (error) {
      console.error("Error fetching available slots:", error);
      toast.error("Failed to load slot data.");
    } finally {
      setLoadingSlots(false);
    }
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

  // Handle payment method selection
  const handlePaymentChange = (value) => {
    setPaymentMethod(value);
  };

  // Calculate total example logic
  const calculateTotal = () => {
    const servicePrice = 100; // Mock service price
    setTotal(servicePrice);
  };

  const handleBooking = async (values: any) => {
    try {
      // Format bookingDate as a string
      const bookingDate = moment(values.pickupDate).format("YYYY-MM-DD");

      // Construct the booking data
      const bookingData = {
        note: values.note || "",
        koiOrPoolId: values.fish || 0,
        vetName: form.getFieldValue("vetName") || "", // Ensure vetName is retrieved correctly
        totalAmount: total,
        location: values.location,
        slotId: values.slot || 0,
        serviceId: values.serviceType || 0,
        paymentId: values.paymentMethod || 0,
        bookingDate: bookingDate,
      };

      console.log("Booking Data:", bookingData); // Debug the data

      const requestPayload = {
        createBookingDto: bookingData,
      };

      // Send booking data to backend API
      const response = await api.post(
        "/booking/create-booking",
        requestPayload
      );

      // Handle success response
      toast.success("Booking successful!");
    } catch (error) {
      // Handle errors
      toast.error("Booking failed: " + error.message);
    }
  };

  // Scroll to section based on hash
  useEffect(() => {
    if (location.hash === "#section") {
      setTimeout(() => {
        if (bookingRef.current) {
          bookingRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div>
      <Header />
      <Banner />
      <Toaster richColors position="top-right" />
      <div ref={bookingRef} id="booking" className="section">
        <div className="section-center">
          <div className="container">
            <div className="row">
              <div className="booking-form">
                <div className="form-header">
                  <h1>Book a Service</h1>
                </div>

                {/* Ant Design Form */}
                <Form
                  form={form}
                  name="bookingForm"
                  layout="vertical"
                  onFinish={handleBooking}
                >
                  {/* Pickup Date */}
                  <div className="row">
                    <div className="col-sm-5">
                      <Form.Item
                        label="Pickup Date"
                        name="pickupDate"
                        rules={[
                          { required: true, message: "Please select a date" },
                        ]}
                      >
                        <DatePicker
                          className="form-control"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Service, Slot, and Vet */}
                  <div className="row">
                    <div className="col-sm-4">
                      <Form.Item
                        label="Type of Service"
                        name="serviceType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a service",
                          },
                        ]}
                      >
                        <Select
                          className="form-control"
                          loading={isLoadingServices}
                        >
                          {services.map((service) => (
                            <Option
                              key={service.serviceID}
                              value={service.serviceID}
                            >
                              {service.serviceName} - ${service.price}{" "}
                              (Duration: {service.estimatedDuration} hours)
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Slot"
                        name="slot"
                        // rules={[
                        //   { required: true, message: "Please select a slot" },
                        // ]}
                      >
                        <Select
                          className="form-control"
                          loading={isLoadingSlots}
                          onChange={handleSlotChange} // Handle slot change
                          value={selectedSlot}
                        >
                          {slots.map((slot) => (
                            <Option key={slot.slotID} value={slot.slotID}>
                              {slot.weekDate} ({slot.startTime} -{slot.endTime})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Veterinarian"
                        name="vet"
                        rules={[
                          { required: true, message: "Please select a vet" },
                        ]}
                      >
                        <Select
                          className="form-control"
                          loading={isLoadingVets}
                          onChange={handleVetChange} // Handle vet change
                          value={selectedVet}
                        >
                          {vets.map((vet) => (
                            <Option key={vet.id} value={vet.id}>
                              {vet.vetName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Item
                        label="Location"
                        name="location"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your location",
                          },
                          {
                            pattern: /^[^\s].+$/,
                            message:
                              "Location cannot start with a space or contain special characters",
                          },
                        ]}
                      >
                        <Input
                          className="form-control"
                          placeholder="Enter your location"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    ]}
                  >
                    <Input
                      className="form-control"
                      placeholder="Enter your phone number"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Choose Fish or Pool"
                    name="fish"
                    rules={[
                      { required: true, message: "Please select an option" },
                    ]}
                  >
                    <Select className="form-control">
                      <Option value={1}>Fish 1</Option>
                      <Option value={2}>Fish 2</Option>
                      <Option value={3}>Pool 1</Option>
                    </Select>
                  </Form.Item>

                  {/* Payment Method Section */}
                  <Form.Item
                    label="Payment Method"
                    name="paymentMethod"
                    rules={[
                      {
                        required: true,
                        message: "Please select a payment method",
                      },
                    ]}
                  >
                    <Select onChange={handlePaymentChange}>
                      <Option value={1}>VNPay</Option>
                      <Option value={2}>Cash on Delivery</Option>
                    </Select>
                  </Form.Item>

                  {/* Total Amount Section */}
                  <h3>Total: {total} $</h3>
                  <Button
                    onClick={calculateTotal}
                    className="calculate-total-btn"
                  >
                    Calculate Total
                  </Button>

                  <div className="form-btn">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-btn"
                    >
                      Book Now
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Booking;
