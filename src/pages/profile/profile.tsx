import { Link } from "react-router-dom";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./profile.scss";

function Profile() {
  const [userData, setUserData] = useState({
    username: "nmaxwell",
    name: "Nelle Maxwell",
    email: "nmaxwell@mail.com",
    company: "Company Ltd.",
  });

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
            src="https://4kwallpapers.com/images/walls/thumbs_3t/12950.png"
            alt="User Avatar"
          />
          <h3>Doang Cong Thanh</h3>
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
                  value={userData.username}
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <Input type="text" name="name" value={userData.name} />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <Input
                  type="text"
                  name="email"
                  value={userData.email}
                  className="mb-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <Input type="text" name="company" value={userData.company} />
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
