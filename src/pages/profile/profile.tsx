import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./profile.scss";
import api from "../../configs/axios"; // Assuming Axios is used for making requests
import { Button, Image, Input } from "antd";
import {
  AimOutlined,
  AuditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { profile } from "../../types/info";
import { Toaster, toast } from "sonner";

function Profile() {
  const [profile, setProfile] = useState<profile | null>(null); // Use the Profile type
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.updateProfileSuccess) {
      toast.success("Profile updated successfully!");

      // Reset location state to prevent duplicate toasts
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/User/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if available
        },
      });

      // Convert gender from boolean to "Male" or "Female"
      const genderProfile = {
        ...response.data,
        gender: response.data.gender ? "Male" : "Female", // Gender conversion
      };

      setProfile(genderProfile); // Set the transformed profile data
    } catch (error) {
      setError(error.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle menu item click
  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  // Handle dark mode toggle
  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : ""}`}>
      <section id="sidebar">
        <Link to="/" className="brand">
          <i className="bx bxs-smile"></i>
          <span className="text">Profile</span>
        </Link>
        <ul className="side-menu top">
          <li className={activeMenuItem === "dashboard" ? "active" : ""}>
            <Link
              to="/profile"
              onClick={() => handleMenuItemClick("dashboard")}
            >
              <i className="bx bxs-dashboard"></i>
              <span className="text">Your Profile</span>
            </Link>
          </li>
          <li className={activeMenuItem === "my-store" ? "active" : ""}>
            <Link to="/process" onClick={() => handleMenuItemClick("my-store")}>
              <i className="bx bxs-shopping-bag-alt"></i>
              <span className="text">Service History</span>
            </Link>
          </li>
          <li className={activeMenuItem === "message" ? "active" : ""}>
            <Link to="/message" onClick={() => handleMenuItemClick("message")}>
              <i className="bx bxs-message-dots"></i>
              <span className="text">Message</span>
            </Link>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <Button className="text" onClick={() => window.history.back()}>
              Back
            </Button>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          <i className="bx bx-menu"></i>

          <input
            type="checkbox"
            id="switch-mode"
            hidden
            checked={isDarkMode}
            onChange={handleDarkModeSwitch}
          />
          <label htmlFor="switch-mode" className="switch-mode"></label>

          <Link to="#" className="profile">
            <img src={profile?.imageURL} alt="profile" />
          </Link>
        </nav>

        <div className="body_profile">
          <div className="container_profile">
            <div className="content">
              <div className="tab-pane fade active show" id="account-general">
                <hr className="border-light m-0" />

                <div className="profile-wrapper">
                  <div className="profile-image">
                    <Image
                      width={200}
                      height={200}
                      src={
                        profile?.imageURL || "https://via.placeholder.com/150"
                      }
                      alt="profile"
                    />

                    {/* Use optional chaining to prevent error if imageURL is null */}
                  </div>
                  <div className="profile-details">
                    <div className="card-body">
                      {/* Profile details with optional chaining for safety */}
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <Input
                          type="text"
                          name="username"
                          value={profile?.userName || "N/A"}
                          readOnly
                          prefix={
                            <UserOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          className="mb-1"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <Input
                          type="text"
                          name="name"
                          value={
                            profile
                              ? `${profile.firstName} ${profile.lastName}`
                              : "N/A"
                          }
                          prefix={
                            <AuditOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Role</label>
                        <Input
                          type="text"
                          name="role"
                          value={profile?.role || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <Input
                          type="text"
                          name="gender"
                          value={profile?.gender || "N/A"} // Gender converted to "Male" or "Female"
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <Input
                          type="text"
                          name="address"
                          value={profile?.address || "N/A"} // Default if address is not available
                          prefix={
                            <AimOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <Input
                          type="text"
                          name="email"
                          value={profile?.email || "N/A"}
                          readOnly
                          prefix={
                            <MailOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          className="mb-1"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <Input
                          type="text"
                          name="phoneNumber"
                          prefix={
                            <PhoneOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          value={profile?.phoneNumber || "N/A"} // Default if phone is not available
                          readOnly
                        />
                      </div>
                      <div className="text-right">
                        <Button className="btn btn-primary">
                          <Link to="/updateProfile">Edit Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default Profile;
