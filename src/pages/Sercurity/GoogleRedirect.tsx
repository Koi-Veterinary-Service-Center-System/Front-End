import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token và thông tin người dùng từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      toast.success("Login successful with Google!");
      navigate("/", { state: { loginSuccess: true } });
    } else {
      toast.error("An error occurred during Google login.");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default GoogleRedirect;
