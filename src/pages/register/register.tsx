import { Button, Form } from "antd";
import {
  LockOutlined,
  MailOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Input from "antd/es/input/Input";
import "./register.scss";
import Header from "../../components/Header/header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import { useEffect, useRef } from "react";
import api from "../../configs/axios";
import { Toaster, toast } from "sonner";

function Register() {
  const location = useLocation();
  const registerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === "#register-container") {
      setTimeout(() => {
        if (registerRef.current) {
          registerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleRegister = async (values) => {
    try {
      const response = await api.post("User/register", values);
      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/", { state: { registerSuccess: true } });
    } catch (error) {
      // Log the error to inspect its structure
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;

        // Assuming the API returns an array of errors or just one error object
        if (Array.isArray(apiErrors)) {
          apiErrors.forEach((err) => toast.error(err.description)); // Display each error's description
        } else if (apiErrors.description) {
          toast.error(apiErrors.description); // Display the single error description
        }
      } else {
        // Handle other cases, like network errors
        toast.error(
          "A network error occurred. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <div className="body-register">
      <Header />
      <Toaster richColors position="top-right" />
      <div ref={registerRef} className="register-container">
        <div className="register-left">
          <h3 className="register-left-title">Register</h3>
          <img
            src="src/assets/images/banner_login.png"
            alt="Koi"
            className="register-image"
          />
        </div>
        <div className="register-right">
          <h3 className="register-right-title">Create Account</h3>

          <div className="in">
            <Form onFinish={handleRegister}>
              <div className="name-row">
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
                    className="register-input"
                    prefix={
                      <SolutionOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your Last Name!" },
                    {
                      pattern: /^[^\s][a-zA-Z\s]+$/,
                      message:
                        "Last name cannot start with a space or contain special characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Last Name"
                    className="register-input"
                    prefix={
                      <SolutionOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                  />
                </Form.Item>
              </div>

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
                  className="register-input"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
              >
                <Input
                  placeholder="Email"
                  className="register-input"
                  prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
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
                  className="register-input"
                  type="password"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
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
                  className="register-input"
                  type="password"
                />
              </Form.Item>

              <Button className="register-button" htmlType="submit">
                Register
              </Button>
            </Form>

            <div className="register-text">
              Already have an account? <Link to="/login">Login</Link>
            </div>

            <div className="divider">OR</div>

            <div className="social-login">
              <Button className="social-button google-button">
                <img
                  className="icon"
                  src="src/assets/images/google.png"
                  alt="Google"
                />
                Sign up with Google
              </Button>
              <Button className="social-button facebook-button">
                <img
                  className="icon"
                  src="src/assets/images/facebook.png"
                  alt="Facebook"
                />
                Sign up with Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
