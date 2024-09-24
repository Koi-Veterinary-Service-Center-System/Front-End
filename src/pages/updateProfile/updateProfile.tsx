import { Link } from "react-router-dom";
import { Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./updateProfile.scss";
import api from "../../configs/axios";

function UpdateProfile() {
  const [profile, setProfile] = useState([]);
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

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
  };

  const handleChange = () => {};

  return (
    <div className="body-updateProfile">
      <Button
        className="btn-back"
        type="primary"
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      <div className="container_updateProfile">
        <div className="sidebar">
          <img
            src="https://4kwallpapers.com/images/walls/thumbs_3t/12950.png"
            alt="User Avatar"
          />
          <h3>Doang Cong Thanh</h3>
          <Link to="/account" className="active">
            Account
          </Link>
          <Link to="/password">Password</Link>
          <Link to="/serviceHistory">View Service History</Link>
        </div>

        <div className="content">
          <div className="tab-pane fade active show" id="account-general">
            <div className="card-body media align-items-center">
              <img
                src="https://4kwallpapers.com/images/walls/thumbs_3t/12950.png"
                alt="Avatar"
                className="d-block ui-w-80"
              />
              <div className="media-body ml-4">
                <Upload
                  name="avatar"
                  showUploadList={false}
                  onChange={handleFileUpload}
                >
                  <Button icon={<UploadOutlined />}>Upload new photo</Button>
                </Upload>
                <div className="text-light small mt-1">
                  Allowed JPG, GIF or PNG. Max size of 800K.
                </div>
              </div>
            </div>

            <hr className="border-light m-0" />

            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={profile.userName}
                  onChange={handleChange}
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={`${profile.firstName} ${profile.lastName}`}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <Input
                  type="text"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="mb-1"
                />
                <div className="alert alert-warning mt-3">
                  Your email is not confirmed. Please check your inbox.
                  <br />
                  <a href="#resend-confirmation">Resend confirmation</a>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <Input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button className="btn btn-primary">
            <Link to="/profile">Save changes</Link>
          </Button>
          &nbsp;
          <Button className="btn btn-default">
            <Link to="/profile">Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
