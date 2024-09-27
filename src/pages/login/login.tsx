import { Button, Form, message, Tooltip } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Input from "antd/es/input/Input";
import "./login.scss"; // Import the CSS file
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import { useEffect, useRef, useState } from "react"; // Import useEffect, useRef
import api from "../../configs/axios";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { auth, googleProvider } from "../../configs/firebase";

function Login() {
  const location = useLocation(); // Hook để truy cập URL
  const loginRef = useRef(null); // Tạo ref để tham chiếu đến div login-container
  const navigate = useNavigate();

  // Auto scroll to the login container
  useEffect(() => {
    if (location.hash === "#login-container") {
      setTimeout(() => {
        if (loginRef.current) {
          loginRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  //Handle Login Google
  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

      // Navigate to the homepage after successful login
      navigate("/");
    } catch (error) {
      // Check if the error is due to invalid credentials
      if (error.response && error.response.status === 401) {
        message.error("Invalid username or password. Please try again.");
      } else {
        // Handle other types of errors (e.g., network errors)
        message.error("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <div className="body-login">
      <Header />
      <div ref={loginRef} className="login-container">
        <div className="login-left">
          <h3 className="login-left-title">Sign in</h3>
          <img
            src="src/assets/images/banner_login.png"
            alt="Koi"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <h3 className="login-right-title">Sign in Account</h3>
          <div className="in">
            <Form onFinish={handleLogin}>
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
                  className="login-input"
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
                  className="login-input"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>

              <Button className="login-button" htmlType="submit">
                Login
              </Button>
            </Form>
            <p className="register-text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <div className="divider">OR</div>
            <div className="social-login">
              <Button
                className="social-button google-button"
                onClick={handleLoginGoogle}
              >
                <img
                  className="icon"
                  src="src/assets/images/google.png"
                  alt=""
                />
                Sign in with Google
              </Button>
              <Button className="social-button facebook-button">
                <img
                  className="icon"
                  src="src/assets/images/facebook.png"
                  alt=""
                />
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
