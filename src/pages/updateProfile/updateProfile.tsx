import { Link } from "react-router-dom";
import { Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./updateProfile.scss";

function UpdateProfile() {
  const [userData, setUserData] = useState({
    username: "nmaxwell",
    name: "Nelle Maxwell",
    email: "nmaxwell@mail.com",
    company: "Company Ltd.",
  });

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="body-updateProfile">
      <Button
        className="btn-back"
        type="primary"
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      <div className="container updateProfile">
        <div className="sidebar">
          <img
            src="https://4kwallpapers.com/images/walls/thumbs_3t/12950.png"
            alt="User Avatar"
          />
          <h3>Doang Cong Thanh</h3>
          <Link to="/account" className="active">
            Account
          </Link>
          <Link to="#password">Password</Link>
          <Link to="#security">Security</Link>
          <Link to="#application">Application</Link>
          <Link to="#notification">Notification</Link>
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
                <Button className="ml-2">Reset</Button>
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
                  value={userData.username}
                  onChange={handleChange}
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <Input
                  type="text"
                  name="email"
                  value={userData.email}
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
                <label className="form-label">Company</label>
                <Input
                  type="text"
                  name="company"
                  value={userData.company}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button className="btn btn-primary">Save changes</Button>
          &nbsp;
          <Button className="btn btn-default">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
