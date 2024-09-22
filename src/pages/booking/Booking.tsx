import "./booking.scss";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Input, Form, Button, Select, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import Banner from "../../components/banner/banner";
import { useLocation } from "react-router-dom";
import HeaderV2 from "../../components/HeaderNoLogin/headerv2";

const { Option } = Select;

function Booking() {
  const [total, setTotal] = useState(0);
  const { TextArea } = Input;
  const [paymentMethod, setPaymentMethod] = useState("");

  // Handle payment method selection
  const handlePaymentChange = (value: string) => {
    setPaymentMethod(value);
  };

  // Example function for calculating the total
  const calculateTotal = () => {
    const servicePrice = 100; // Adjust as necessary
    setTotal(servicePrice);
  };

  // Handle form submit and log the values
  const handleSubmit = (values: string) => {
    console.log("Form Values:", values); // Check if values are logged correctly
  };

  const location = useLocation();
  const bookingRef = useRef(null);

  useEffect(() => {
    if (location.hash == "#section") {
      setTimeout(() => {
        if (bookingRef.current) {
          bookingRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div>
      <HeaderV2 />
      <Banner />
      <section ref={bookingRef} id="booking" className="booking">
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
                  onFinish={handleSubmit} // onFinish triggers handleSubmit
                >
                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your name",
                          },
                          {
                            pattern: /^[^\s][a-zA-Z\s]+$/,
                            message:
                              "Name cannot start with a space or contain special characters",
                          },
                        ]}
                      >
                        <Input
                          className="form-control"
                          placeholder="Enter your Name"
                        />
                      </Form.Item>
                    </div>

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
                            pattern: /^[^\s][a-zA-Z\s]+$/,
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
                    label="Name your Fish"
                    name="fish"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your fish's name",
                      },
                      {
                        pattern: /^[^\s][a-zA-Z\s]+$/,
                        message:
                          "Fish name cannot start with a space or contain special characters",
                      },
                    ]}
                  >
                    <Input
                      className="form-control"
                      placeholder="Enter your fish's name"
                    />
                  </Form.Item>

                  <Form.Item name="detailOfFish">
                    <TextArea
                      placeholder="Detail your fish"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>

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

                    <div className="col-sm-7">
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
                      </div>
                    </div>
                  </div>

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
                  <h3>Total: {total} VND</h3>
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
      </section>
      <Footer />
    </div>
  );
}

export default Booking;
