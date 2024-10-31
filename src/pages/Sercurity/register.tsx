import { motion } from "framer-motion";
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { GrContactInfo } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../configs/axios";
import Header from "@/components/Header/header";
import { FaUser } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    try {
      const response = await api.post("User/register", values);
      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/", { state: { registerSuccess: true } });
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
        >
          <div className="md:flex">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 bg-blue-300 p-8 text-white hidden md:block"
            >
              <h2 className="text-3xl font-bold mb-4 text-blue-800">
                Welcome to KoiNe
              </h2>
              <p className="mb-6 text-blue-800">
                Join our community and take control of your koi health journey.
              </p>
              <img
                src="src\assets\images\banner-login.png"
                alt="Medical care illustration"
                className="rounded-lg flex justify-center align-middle"
              />
            </motion.div>
            <div className="md:w-1/2 p-8">
              <motion.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-6 text-blue-800"
              >
                Create Your Account
              </motion.h3>
              <Form onFinish={handleRegister} layout="vertical">
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name!",
                      },
                      {
                        pattern: /^[^\s][a-zA-Z\s]+$/,
                        message:
                          "First name cannot start with a space or contain special characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="First Name"
                      prefix={<GrContactInfo className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <Form.Item
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Name!",
                      },
                      {
                        pattern: /^[^\s][a-zA-Z\s]+$/,
                        message:
                          "Last name cannot start with a space or contain special characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Last Name"
                      prefix={<GrContactInfo className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                      {
                        min: 4,
                        message: "Username must be at least 4 characters long!",
                      },
                      {
                        max: 20,
                        message: "Username cannot exceed 20 characters!",
                      },
                      {
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message:
                          "Username can only contain letters, numbers, and underscores!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Username"
                      prefix={<UserOutlined className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please input your Email!" },
                      { type: "email", message: "Please enter a valid Email!" },
                    ]}
                  >
                    <Input
                      placeholder="Email"
                      prefix={<MailOutlined className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 }}
                >
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters long!",
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Password"
                      prefix={<LockOutlined className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.9 }}
                >
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      prefix={<LockOutlined className="text-blue-500" />}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                </motion.div>
                <motion.div
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1 }}
                >
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Register
                    </Button>
                  </Form.Item>
                </motion.div>
              </Form>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center text-blue-800 mt-4"
              >
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-center text-blue-800 font-semibold"
              >
                OR
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-4 space-y-3"
              >
                <Button
                  icon={
                    <img
                      src="src\assets\images\google.png"
                      alt="Google"
                      className="mr-2 h-6 w-6"
                    />
                  }
                  size="large"
                  block
                  className="border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700 mb-2"
                >
                  Sign up with Google
                </Button>
                <Link to="/">
                  <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200">
                    <FaUser className="mr-2 h-5 w-5" />
                    Continue with Guest account
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Register;
