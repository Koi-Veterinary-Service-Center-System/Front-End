import { Link } from "react-router-dom";
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

function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get("User/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if available
        },
      });

      // Convert gender from boolean to "Male" or "Female"
      const updatedProfile = {
        ...response.data,
        gender: response.data.gender ? "Male" : "Female", // Gender conversion
      };

      setProfile(updatedProfile); // Set the transformed profile data
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
        <Link to="#" className="brand">
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
            <img
              src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
              alt="profile"
            />
          </Link>
        </nav>

        <div className="body_profile">
          <iframe
            className="profile_video"
            src="src\assets\images\Koi Fish Pond Live Wallpaper.mp4"
            width="640"
            height="360"
            frameBorder="0"
            allow="autoplay: fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="container_profile">
            <div className="content">
              <div className="tab-pane fade active show" id="account-general">
                <hr className="border-light m-0" />

                <div className="profile-wrapper">
                  <div className="profile-image">
                    <Image width={200} src={profile.imageURL} />
                    {/* Update with the image source */}
                  </div>
                  <div className="profile-details">
                    <div className="card-body">
                      {/* Your profile details go here (unchanged) */}

                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <Input
                          type="text"
                          name="username"
                          value={profile.userName}
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
                          value={`${profile.firstName} ${profile.lastName}`}
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
                          value={profile.role || "N/A"} // Default if role is not available
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <Input
                          type="text"
                          name="gender"
                          value={profile.gender || "N/A"} // Gender converted to "Male" or "Female"
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <Input
                          type="text"
                          name="address"
                          value={profile.address || "N/A"} // Default if address is not available
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
                          value={profile.email}
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
                          name="phone"
                          prefix={
                            <PhoneOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          value={profile.phoneNumber} // Default if phone is not available
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
    </div>
  );
}

export default Profile;
