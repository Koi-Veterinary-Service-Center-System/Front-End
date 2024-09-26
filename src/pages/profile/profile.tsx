import { Link } from "react-router-dom";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./profile.scss";
import api from "../../configs/axios"; // Assuming Axios is used for making requests

function Profile() {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if available
        },
      });
      setProfile(response.data); // Assuming the API response contains the profile data
    } catch (error) {
      setError(error.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="body_updateProfile">
      <Button
        className="btn-back"
        type="primary"
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      <div className="container_profile">
        <div className="sidebar">
          <img
            src={
              profile.imageURL ||
              "https://4kwallpapers.com/images/walls/thumbs_3t/12950.png"
            }
            alt="User Avatar"
          />
          <h3>
            {profile.firstName} {profile.lastName}
          </h3>
          <Link to="/account" className="active">
            Account
          </Link>
          <Link to="/password">Password</Link>
          <Link to="/serviceHistory">View service history</Link>
        </div>

        <div className="content">
          <div className="tab-pane fade active show" id="account-general">
            <hr className="border-light m-0" />

            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={profile.userName}
                  readOnly
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={`${profile.firstName} ${profile.lastName}`}
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
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <Input
                  type="text"
                  name="phone"
                  value={profile.phone || "N/A"} // Default if company is not available
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button className="btn btn-primary">
            <Link to="/updateProfile">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
