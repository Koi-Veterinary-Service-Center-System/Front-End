import { Button, Form } from "antd";
import Input from "antd/es/input/Input";
import "./register.scss"; // Import the CSS file
import Header from "../../components/Header/header";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import { useEffect, useRef } from "react";
import { Object } from "../../types/info";

function Register() {
  const location = useLocation(); // Hook để truy cập URL
  const registerRef = useRef(null); // Tạo ref để tham chiếu đến div login-container

  useEffect(() => {
    if (location.hash === "#register-container") {
      // Kiểm tra nếu URL có chứa hash #login-container
      setTimeout(() => {
        if (registerRef.current) {
          registerRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn đến phần tử
        }
      }, 100); // Delay nhỏ để đảm bảo DOM được render xong
    }
  }, [location.hash]);

  const handleFinish = (values: Object) => {
    console.log(values);
  };
  return (
    <div className="body">
      <Header />
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
            <Form onFinish={handleFinish}>
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
                    className="register-input-s"
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
                  <Input placeholder="Last Name" className="register-input-s" />
                </Form.Item>
              </div>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your Phone Number!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please input a valid phone number!",
                  },
                ]}
              >
                <Input placeholder="Phone" className="register-input" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
              >
                <Input placeholder="Email" className="register-input" />
              </Form.Item>

              <Form.Item
                name="address"
                rules={[
                  { required: true, message: "Please input your Address!" },
                  {
                    pattern: /^[^\s][a-zA-Z\s]+$/,
                    message:
                      "Address cannot start with a space or contain special characters",
                  },
                ]}
              >
                <Input placeholder="Address" className="register-input" />
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
                <Input placeholder="Password" className="register-input" />
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
                <Input
                  placeholder="Confirm Password"
                  className="register-input"
                />
              </Form.Item>

              <Button className="login-button" htmlType="submit">
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
