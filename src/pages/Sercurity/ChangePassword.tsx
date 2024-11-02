import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { Form, Input, Button, Card } from "antd";
import { toast } from "sonner";
import api from "@/configs/axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo router

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onFinish = async (values: string) => {
    const { email, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/User/reset-password", {
        email,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        navigate("/login");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("Error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] bg-white shadow-lg border-blue-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">Change Password</h2>
            <p className="text-blue-100">
              Enter your email and new password below.
            </p>
          </div>
          <Form layout="vertical" onFinish={onFinish} className="p-6 space-y-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<FiMail className="text-blue-400" />}
                placeholder="Enter your email"
                className="pl-2"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<FiLock className="text-blue-400" />}
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                addonAfter={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-blue-400 hover:text-blue-600"
                  ></button>
                }
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<FiLock className="text-blue-400" />}
                placeholder="Confirm new password"
                type={showPassword ? "text" : "password"}
                addonAfter={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-blue-400 hover:text-blue-600"
                  ></button>
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full"
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </Form.Item>
          </Form>
          <div className="text-sm text-center text-blue-600 p-4">
            Make sure your new password is strong and unique.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}