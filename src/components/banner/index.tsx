import { useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import "./index.scss";
import api from "@/configs/axios";
import { koiOrPool } from "@/types/info";
import { toast } from "sonner";
import ShimmerButton from "../ui/shimmer-button";

function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle form submission
  const handleCreateFishOrPool = async (values: koiOrPool) => {
    if (loading) return;

    const payload = {
      ...values,
      isPool: values.isPool ? true : false,
    };

    try {
      const response = await api.post("/koi-or-pool/create-koiorpool", payload);

      if (response.status === 200) {
        toast.success("Successfully added!"); // Display success toast
        handleCloseModal();
      } else {
        toast.error("Failed to add the item."); // Display error toast if the response isn't 200
      }
    } catch (error) {
      // Catch errors and display appropriate error toast
      toast.error(
        error.response?.data?.errors?.IsPool[0] ||
          "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="banner-section">
      <div className="right">
        <h1>Koi Shop</h1>
        <h3>If animals could talk, they'd talk about us!</h3>
        <p>
          At a vehicula est proin turpis pellentesque sinulla a aliquam amet
          rhoncus quisque eget sit
        </p>
        <div className="flex gap-3">
          <ShimmerButton href="/booking" className="shadow-2xl">
            Booking Service
          </ShimmerButton>
          <ShimmerButton className="fakeButton" onClick={handleOpenModal}>
            Create Koi Or Pool
          </ShimmerButton>
        </div>
      </div>

      <div className="koi-banner">
        <img src="src/assets/images/bannerHome.png" alt="Koi Banner" />
      </div>

      <Modal
        open={isModalOpen}
        title="Create Koi Or Pool"
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleCreateFishOrPool}
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

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Banner;
