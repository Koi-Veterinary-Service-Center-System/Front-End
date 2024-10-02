import { Link, useNavigate } from "react-router-dom";
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
} from "antd";
import {
  AimOutlined,
  AuditOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { profile as ProfileType } from "../../types/info";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../configs/firebase";
import { Toaster, toast } from "sonner";

function UpdateProfile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

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
    } catch (error: any) {
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

  const uploadFileToFirebase = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `profile_pictures/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Theo dõi tiến trình upload nếu cần
        },
        (error) => {
          reject(error); // Xử lý lỗi nếu upload thất bại
        },
        () => {
          // Upload thành công, lấy URL của file
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Trả về URL của ảnh
          });
        }
      );
    });
  };

  const handleUpdateProfile = async (values: string) => {
    setLoading(true);

    try {
      let imageURL = profile?.imageURL || ""; // Use current image if no new image

      if (fileList.length > 0 && fileList[0].originFileObj) {
        // If a new image is uploaded, upload to Firebase
        const file = fileList[0].originFileObj;
        imageURL = await uploadFileToFirebase(file); // Upload the image and get the URL
      }

      // Convert "Male" to true, "Female" to false for API compatibility
      const updatedProfile = {
        ...values,
        gender: values.gender === "Male" ? true : false,
        imageURL, // Update the image URL
      };

      await api.put(
        "User/update-profile",
        updatedProfile, // Send the updated profile data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token for authentication
          },
        }
      );

      fetchProfile(); // Refresh profile after update
      navigate("/profile", { state: { updateProfileSuccess: true } }); // Navigate to the profile page
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`updateProfile-page ${isDarkMode ? "dark-mode" : ""}`}>
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

          <Link to="#" className="updateProfile">
            <img
              src={profile?.imageURL || "https://via.placeholder.com/150"}
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
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={() => false} // Không upload trực tiếp lên server
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                      {previewImage && (
                        <Image
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
                    <Form.Item label="Username" name="userName">
                      <Input
                        placeholder={profile?.userName || "Enter username"}
                        prefix={
                          <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="First Name" name="firstName">
                      <Input
                        placeholder={profile?.firstName || "Enter first name"}
                        prefix={
                          <AuditOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Last Name" name="lastName">
                      <Input
                        placeholder={profile?.lastName || "Enter last name"}
                        prefix={
                          <AuditOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Phone Number" name="phoneNumber">
                      <Input
                        placeholder={
                          profile?.phoneNumber || "Enter phone number"
                        }
                        prefix={
                          <PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                      <Input
                        placeholder={profile?.email || "Enter email"}
                        prefix={
                          <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Address" name="address">
                      <Input
                        placeholder={profile?.address || "Enter address"}
                        prefix={
                          <AimOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Gender" name="gender">
                      <Input placeholder={profile?.gender || "Enter gender"} />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Update Profile
                      </Button>
                      <Button className="btn btn-default">
                        <Link to="/profile">Cancel</Link>
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default UpdateProfile;
