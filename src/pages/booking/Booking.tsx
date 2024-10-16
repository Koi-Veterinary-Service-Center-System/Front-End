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
import TextArea from "antd/es/input/TextArea";

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
        toast.error("Failed to load your koi and pools.");
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
    } catch (error: any) {
      console.error("Booking error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.data.error;

        if (
          errorMessage &&
          errorMessage.includes("FK_Bookings_Payments_PaymentID")
        ) {
          toast.error(
            "Invalid payment method selected. Please choose a valid payment option."
          );
        } else if (errorMessage && errorMessage.includes("foreign key")) {
          toast.error(
            "There was an issue with your selection. Please ensure all options are valid."
          );
        } else {
          toast.error(
            `Booking failed: ${errorMessage || "An unexpected error occurred"}`
          );
        }
      } else if (error.request) {
        toast.error(
          "Unable to connect to the server. Please check your connection and try again."
        );
      } else {
        toast.error(`An error occurred: ${error.message}`);
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
    <div>
      <Header />
      <Banner />

      <div ref={bookingRef} id="booking" className="section">
        <div className="section-center">
          <div className="container">
            <div className="row">
              <div className="booking-form">
                <div className="form-header">
                  <h1>Book a Service</h1>
                </div>

                <Form
                  form={form}
                  name="bookingForm"
                  layout="vertical"
                  onFinish={handleBooking}
                >
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
                        label="Type of Services"
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
                          onChange={() => calculateTota()} // Trigger calculation on service change
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
                      <Form.Item label="Slot" name="slot">
                        <Select
                          className="form-control"
                          loading={isLoadingSlots}
                          onChange={handleSlotChange}
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
                          onChange={handleVetChange}
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

                  <Form.Item label="Choose District" name="district">
                    <Select
                      className="form-control"
                      loading={isLoadingDistance}
                      placeholder="Select a district"
                      onChange={() => calculateTota()} // Trigger calculation on district change
                    >
                      {distances.map((distance) => (
                        <Option
                          key={distance.distanceID}
                          value={distance.distanceID}
                        >
                          {distance.district} - {distance.area} ($
                          {distance.price})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Choose Fish or Pool" name="koiOrPoolId">
                    <Select
                      className="form-control"
                      loading={isLoadingKoiAndPools}
                      placeholder="Select a fish or pool"
                    >
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

                  <Form.Item label="Note" name="note">
                    <TextArea className="form-control"></TextArea>
                  </Form.Item>

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
                    <Select
                      className="form-control"
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

                  <h3>Total: {total} $</h3>
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
