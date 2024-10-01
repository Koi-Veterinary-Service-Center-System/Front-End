import { useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import "./index.scss"; // Correctly import your SCSS file here
import api from "@/configs/axios"; // Ensure your axios instance is properly configured
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { koiOrPool } from "@/types/info";

function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [loading, setLoading] = useState(false); // To handle the loading state for form submission
  const [form] = Form.useForm(); // Ant Design form instance

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Clear the form fields after closing the modal
  };

  // Handle form submission and post the data to API
  const handleCreateFishOrPool = async (values: koiOrPool) => {
    // Ensure `isPool` is a boolean value
    const payload = {
      ...values,
      isPool: values.isPool ? true : false, // Make sure it's a boolean
    };

    setLoading(true);
    try {
      const response = await api.post("/koi-or-pool/create-koiorpool", payload);

      if (response.status === 200) {
        toast.success("Successfully added!");
        handleCloseModal(); // Close modal if API call succeeds
      } else {
        toast.error("Failed to add the item.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.IsPool[0] ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="banner-section">
      <div className="right">
        <h1>Pet Shop</h1>
        <h3>If animals could talk, they'd talk about us!</h3>
        <p>
          At a vehicula est proin turpis pellentesque sinulla a aliquam amet
          rhoncus quisque eget sit
        </p>
        <Button className="fakeButton">
          <Link to="/booking#section">Booking Service</Link>
        </Button>
        {/* Button to open modal */}
        <Button className="fakeButton" onClick={handleOpenModal}>
          Create Koi Or Pool
        </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="koi-banner">
        <img src="src/assets/images/bannerHome.png" alt="Koi Banner" />
      </div>

      <Modal
        open={isModalOpen}
        title="Create Koi Or Pool"
        onCancel={handleCloseModal}
        footer={null} // Custom footer will be handled by form buttons
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleCreateFishOrPool} // Handle form submission
        >
          <Form.Item
            label="Name Your Fish Or Pool"
            name="name"
            rules={[
              { required: true, message: "Please input a name!" },
              { min: 2, message: "Name must be at least 2 characters long!" },
              { max: 50, message: "Name cannot exceed 50 characters!" },
              {
                pattern: /^[^\s][a-zA-Z\s]+$/,
                message: "Name cannot contain special characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Handling Checkbox */}
          <Form.Item
            label="Is this a Pool?"
            name="isPool"
            valuePropName="checked"
          >
            <Checkbox>Pool</Checkbox>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please provide a description!" },

              {
                min: 10,
                message: "Description must be at least 10 characters!",
              },
              {
                max: 500,
                message: "Description cannot exceed 500 characters!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Form submit button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading} // Add loading spinner during submission
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Banner;
