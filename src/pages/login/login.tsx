import { Button, Form } from "antd";
import Input from "antd/es/input/Input";
import "./login.scss"; // Import the CSS file
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import { auth, googleProvider } from "../../configs/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useRef } from "react"; // Import useEffect, useRef

function Login() {
  const location = useLocation(); // Hook để truy cập URL
  const loginRef = useRef(null); // Tạo ref để tham chiếu đến div login-container
  const navigate = useNavigate();
  useEffect(() => {
    if (location.hash === "#login-container") {
      // Kiểm tra nếu URL có chứa hash #login-container
      setTimeout(() => {
        if (loginRef.current) {
          loginRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn đến phần tử
        }
      }, 100); // Delay nhỏ để đảm bảo DOM được render xong
    }
  }, [location.hash]);

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

  const handleFinish = (values = Object) => {
    console.log(values); // Handle form submission
  };

  return (
    <div className="body">
      <Header />
      <div ref={loginRef} className="login-container">
        {/* Đây là div sẽ được cuộn đến */}
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
            <Form onFinish={handleFinish}>
              <Form.Item
                name={"username"}
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
                <Input placeholder="Username" className="login-input" />
              </Form.Item>
              <Form.Item
                name={"password"}
                rules={[{ required: true, message: "Not correct Password!" }]}
              >
                <Input
                  placeholder="Password"
                  type="password"
                  className="login-input"
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
