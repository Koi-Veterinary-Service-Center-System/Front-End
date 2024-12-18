import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../configs/axios";
import Header from "@/components/Header/header";
import { FaUser } from "react-icons/fa";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const user = queryParams.get("user");
    const error = queryParams.get("error");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      const parsedUser = JSON.parse(user); // Parse user string to an object

      // Check the role of the user and navigate to /service if applicable
      if (parsedUser.role === "Staff" || parsedUser.role === "Manager") {
        navigate("/service");
      } else {
        toast.success(`Welcome ${parsedUser.username || "User"}!`);
        navigate("/", { state: { loginSuccess: true } });
      }
    } else if (error) {
      toast.error("Google login failed.");
    }
  }, [location, navigate]);

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await api.post("User/login", values);
      const { token } = response.data;

      // Decode JWT to extract user role
      const decodedToken: { role?: string } = jwtDecode(token);

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Check role and navigate accordingly
      if (decodedToken.role === "Staff" || decodedToken.role === "Manager") {
        navigate("/service");
      } else {
        navigate("/", { state: { loginSuccess: true } });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.error(errorMessage);
    }
  };

  const handleResetPassword = async (values: { email: string }) => {
    try {
      await api.post("/User/request-password-reset", values);
      toast.success("Password reset instructions sent to your email.");
      setIsResetPassword(false);
    } catch (error) {
      const axiosError = error as AxiosError;

      // Safely access `response.data`, and use JSON.stringify if it's an object
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) || "An error occurred";

      toast.error(errorMessage); // Display error message
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      <Header />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
          <div className="md:flex">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 bg-blue-100 p-8 text-white hidden md:block"
            >
              <h2 className="text-3xl font-bold mb-4 text-blue-800">
                Welcome to KoiNe
              </h2>
              <p className="mb-6 text-blue-800">
                Your health koi is our priority. Log in to access your medical
                records and appointments.
              </p>
              <img
                src="src\assets\images\banner-login.png"
                alt="Medical care illustration"
                className="rounded-lg"
              />
            </motion.div>

            <div className="md:w-1/2 p-8 align-middle justify-center">
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-6 text-blue-800"
              >
                {isResetPassword ? "Reset Password" : "Sign in to Your Account"}
              </motion.h3>
              {!isResetPassword ? (
                <Form onFinish={handleLogin} layout="vertical">
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
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-blue-500" />}
                      placeholder="Username"
                      size="large"
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-blue-500" />}
                      placeholder="Password"
                      size="large"
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Log in
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Form onFinish={handleResetPassword} layout="vertical">
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      {
                        type: "email",
                        message: "Please enter a valid email address!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-blue-500" />}
                      placeholder="Email"
                      size="large"
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              )}
              <div className="mt-4 text-center">
                {isResetPassword ? (
                  <Button
                    type="link"
                    onClick={() => setIsResetPassword(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back to Login
                  </Button>
                ) : (
                  <Button
                    type="link"
                    onClick={() => setIsResetPassword(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot Password?
                  </Button>
                )}
              </div>
              {!isResetPassword && (
                <>
                  <div className="mt-6 text-center text-blue-800 font-semibold">
                    OR
                  </div>
                  <div className="mt-4 space-y-3">
                    <Link to="/">
                      <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200">
                        <FaUser className="mr-2 h-5 w-5" />
                        Continue with Guest account
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-6 text-center text-blue-800">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
