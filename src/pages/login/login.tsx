import { Button, Form } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Input from "antd/es/input/Input";

import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import api from "../../configs/axios";

import { toast } from "sonner";
import { useEffect } from "react";

function Login() {
  // Tạo ref để tham chiếu đến div login-container
  const navigate = useNavigate();
  const location = useLocation();

  //Handle Login google
  const handleLoginGoogle = () => {
    // This opens a new window or redirects the user for Google login
    window.open("http://localhost:5155/api/User/google-login", "_self");
  };

  useEffect(() => {
    // Extract query parameters from the URL (after redirection from Google login)
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const user = queryParams.get("user");
    const error = queryParams.get("error");

    // Handle successful login
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      toast.success(`Welcome ${user}!`);
      navigate("/", { state: { loginSuccess: true } });
    }
    // Handle login failure, but only if the login process was initiated
    else if (error) {
      toast.error("Google login failed.");
    }
  }, [location, navigate]);

  // Handle Login
  const handleLogin = async (values: string) => {
    try {
      // Send request to the backend
      const response = await api.post("User/login", values);

      // Extract token and user information
      const { token } = response.data;

      // Save the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Show success message and navigate to homepage

      navigate("/", { state: { loginSuccess: true } });
    } catch (error) {
      // Check if the error is due to invalid credentials
      if (error.response && error.response.status === 401) {
        toast.error("Invalid username or password. Please try again.");
      } else {
        // Handle other types of errors (e.g., network errors)
        toast.error("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/images/background_image.png')",
      }}
    >
      <Header />
      <div className="flex justify-center items-center w-[70%] mx-auto my-20 rounded-2xl shadow-lg bg-gray-100 p-8">
        <div className="bg-[#FDF2E9] w-2/5 flex flex-col items-center justify-center py-8 px-6 rounded-xl opacity-70">
          <h3 className="text-2xl font-bold mb-8">Sign in</h3>
          <img
            src="src/assets/images/banner_login.png"
            alt="Koi"
            className="w-4/5 rounded-lg"
          />
        </div>
        <div className="bg-white w-3/5 py-16 px-12 shadow-md rounded-xl">
          <h3 className="text-2xl font-bold mb-8">Sign in Account</h3>
          <div className="flex flex-col items-center justify-center">
            <Form onFinish={handleLogin} className="w-full">
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  {
                    min: 4,
                    message: "Username must be at least 4 characters long!",
                  },
                  { max: 20, message: "Username cannot exceed 20 characters!" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores!",
                  },
                ]}
              >
                <Input
                  placeholder="Username"
                  className="mb-6 h-12 text-lg rounded-md"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  type="password"
                  className="mb-6 h-12 text-lg rounded-md"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>
              <Button
                className="w-full bg-[#2a3c79] text-white h-12 text-lg rounded-md mb-6"
                htmlType="submit"
              >
                Login
              </Button>
            </Form>
            <p className="text-center text-gray-700 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-500">
                Register
              </Link>
            </p>
            <div className="text-center text-gray-400 my-6 font-semibold">
              OR
            </div>
            <div className="flex space-x-4">
              <Button
                className="w-1/2 h-12 text-lg rounded-md bg-white text-black border border-gray-200 hover:opacity-90"
                onClick={handleLoginGoogle}
              >
                <img
                  className="w-6 inline"
                  src="src/assets/images/google.png"
                  alt="Google icon"
                />{" "}
                Sign in with Google
              </Button>
              <Button className="w-1/2 h-12 text-lg rounded-md bg-blue-600 text-white hover:opacity-90">
                <img
                  className="w-6 inline"
                  src="src/assets/images/facebook.png"
                  alt="Facebook icon"
                />{" "}
                Sign in with Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
