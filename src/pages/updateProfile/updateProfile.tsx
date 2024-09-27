import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./updateProfile.scss";
import api from "../../configs/axios"; // Assuming Axios is used for making requests
import {
  Button,
  Form,
  Image,
  Input,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import {
  AimOutlined,
  AuditOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

function UpdateProfile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

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

  // Handle image upload
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);

    // Convert "Male" to true, "Female" to false for API compatibility
    const updatedProfile = {
      ...values,
      gender: values.gender === "Male" ? true : false,
    };

    try {
      await api.put(
        "User/update-profile",
        updatedProfile, // Send the updated profile data with correct gender format
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token for auth
          },
        }
      );
      message.success("Profile updated successfully!");
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`updateProfile-page ${isDarkMode ? "dark-mode" : ""}`}>
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

          <Link to="#" className="updateProfile">
            <img
              src={profile.imageURL || "https://via.placeholder.com/150"}
              alt="profile"
            />
          </Link>
        </nav>

        <div className="body_updateProfile">
          <div className="container_updateProfile">
            <div className="content">
              <Form
                layout="vertical"
                initialValues={profile}
                onFinish={handleUpdateProfile}
              >
                <div className="updateProfile-wrapper">
                  <div className="updateProfile-image">
                    <Form.Item label="Avatar" name="imageURL">
                      <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 8 ? null : uploadButton}
                      </Upload>
                      {previewImage && (
                        <Image
                          wrapperStyle={{ display: "none" }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                          }}
                          src={previewImage}
                        />
                      )}
                    </Form.Item>
                  </div>
                  <div className="updateProfile-details">
                    <div className="form-group">
                      <Form.Item
                        label="Username"
                        name="userName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                          {
                            min: 4,
                            message:
                              "Username must be at least 4 characters long!",
                          },
                          {
                            max: 20,
                            message: "Username cannot exceed 20 characters!",
                          },
                          {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message:
                              "Username can only contain letters, numbers, and underscores!",
                          },
                        ]}
                      >
                        <Input
                          placeholder={profile.userName}
                          prefix={
                            <UserOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Last Name!",
                          },
                          {
                            pattern: /^[^\s][a-zA-Z\s]+$/,
                            message:
                              "Last name cannot start with a space or contain special characters",
                          },
                        ]}
                      >
                        <Input
                          placeholder={profile.firstName}
                          prefix={
                            <AuditOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Last Name!",
                          },
                          {
                            pattern: /^[^\s][a-zA-Z\s]+$/,
                            message:
                              "Last name cannot start with a space or contain special characters",
                          },
                        ]}
                      >
                        <Input
                          placeholder={profile.lastName}
                          prefix={
                            <AuditOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item label="Gender" name="gender">
                        <Input placeholder={profile.gender || "N/A"} />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item label="ImageURL" name="imageURl">
                        <Input placeholder={profile.imageURL || "N/A"} />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "Please input your address!",
                          },
                        ]}
                      >
                        <Input
                          placeholder={profile.address || "N/A"}
                          prefix={
                            <AimOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Email!",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid Email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder={profile.email}
                          prefix={
                            <MailOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <Form.Item label="Phone" name="phoneNumber">
                        <Input
                          placeholder={profile.phoneNumber || "N/A"}
                          prefix={
                            <PhoneOutlined
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="text-right">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Save Changes
                      </Button>
                      <Button className="btn btn-default">
                        <Link to="/profile">Cancel</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UpdateProfile;
