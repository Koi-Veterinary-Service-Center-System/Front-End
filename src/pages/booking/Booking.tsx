import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Input, Form, Button, Select, DatePicker, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../../components/banner";
import api from "../../configs/axios";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

function Booking() {
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const location = useLocation();
  const bookingRef = useRef(null);

  // Handle payment method selection
  const handlePaymentChange = (value) => {
    setPaymentMethod(value);
  };

  // Calculate total example logic
  const calculateTotal = () => {
    const servicePrice = 100; // Mock service price
    setTotal(servicePrice);
  };

  // Handle form submission
  const handleBooking = async (values) => {
    try {
      // Format the booking date using moment (or dayjs if you've switched)
      const bookingDate = {
        year: moment(values.pickupDate).year(),
        month: moment(values.pickupDate).month() + 1, // Months are 0-indexed
        day: moment(values.pickupDate).date(),
        dayOfWeek: moment(values.pickupDate).day(),
      };

      // Create the object matching API requirements
      const bookingData = {
        createBookingDto: {
          customerUserName: "string", // Add the actual username or dynamic data
          note: values.note || "", // Optional note field
          koiOrPoolId: values.fish || 0,
          vetName: values.vet || "string", // Add the actual vet name
          totalAmount: total, // Total calculated amount
          location: values.location,
          slotId: values.slot || 0, // Add slot id
          serviceId: values.serviceType || 0, // Add service id
          paymentId: values.paymentMethod || 0, // Add payment id
          bookingDate: bookingDate,
        },
      };

      // Make the API call with the correctly structured data
      const response = await api.post("/booking/create-booking", bookingData);

      // Handle response
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
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
                        <Select className="form-control">
                          <Option value={1}>Service 1</Option>
                          <Option value={2}>Service 2</Option>
                          <Option value={3}>Service 3</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Slot"
                        name="slot"
                        rules={[
                          { required: true, message: "Please select a slot" },
                        ]}
                      >
                        <Select className="form-control">
                          <Option value={1}>Slot 1</Option>
                          <Option value={2}>Slot 2</Option>
                          <Option value={3}>Slot 3</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Vet"
                        name="vet"
                        rules={[
                          { required: true, message: "Please select a vet" },
                        ]}
                      >
                        <Select className="form-control">
                          <Option value="Vet A">Vet A</Option>
                          <Option value="Vet B">Vet B</Option>
                          <Option value="Vet C">Vet C</Option>
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
