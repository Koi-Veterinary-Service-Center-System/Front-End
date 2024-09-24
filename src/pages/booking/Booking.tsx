import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Input, Form, Button, Select, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../../components/banner";

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

  // Example function for calculating the total
  const calculateTotal = () => {
    const servicePrice = 100; // Adjust as necessary
    setTotal(servicePrice);
  };

  // Handle form submit and log the values
  const handleSubmit = (values) => {
    console.log("Form Values:", values);
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
                  onFinish={handleSubmit}
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
                          <Option value="service1">Service 1</Option>
                          <Option value="service2">Service 2</Option>
                          <Option value="service3">Service 3</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Slot"
                        name="slot"
                        rules={[
                          {
                            required: true,
                            message: "Please select a slot",
                          },
                        ]}
                      >
                        <Select className="form-control">
                          <Option value="slot1">Slot 1</Option>
                          <Option value="slot2">Slot 2</Option>
                          <Option value="slot3">Slot 3</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="col-sm-4">
                      <Form.Item
                        label="Vet"
                        name="vet"
                        rules={[
                          {
                            required: true,
                            message: "Please select a vet",
                          },
                        ]}
                      >
                        <Select className="form-control">
                          <Option value="vet1">Vet 1</Option>
                          <Option value="vet2">Vet 2</Option>
                          <Option value="vet3">Vet 3</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your address",
                          },
                          {
                            pattern: /^[^\s].+$/,
                            message:
                              "Address cannot start with a space or contain special characters",
                          },
                        ]}
                      >
                        <Input
                          className="form-control"
                          placeholder="Enter your address"
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
                      {
                        required: true,
                        message: "Please select a service",
                      },
                    ]}
                  >
                    <Select className="form-control">
                      <Option value="fish1">Fish 1</Option>
                      <Option value="fish2">Fish 2</Option>
                      <Option value="pool1">Pool 1</Option>
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
                      <Option value="vnpay">VNPay</Option>
                      <Option value="cash">Cash on Delivery</Option>
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
