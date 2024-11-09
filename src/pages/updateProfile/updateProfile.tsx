import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../configs/axios";
import {
  Button,
  Form,
  Input,
  Select,
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
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SlidebarProfile from "@/components/Sidebar/SlidebarProfile";

function UpdateProfile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const backgroundStyle = {
    backgroundImage: "url('src/assets/images/subtle-prism.png')", // Add the path to your image here
    backgroundSize: "cover", // Makes the background cover the entire area
    backgroundPosition: "center", // Centers the background
    backgroundRepeat: "no-repeat", // Ensures the image doesn't repeat
  };

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedProfile = {
        ...response.data,
        gender: response.data.gender ? "Male" : "Female",
      };

      setProfile(updatedProfile);
    } catch (error: any) {
      setError(error.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

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
          // Progress tracking if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);

    try {
      let imageURL = profile?.imageURL || "";

      // Kiểm tra nếu có file ảnh mới được tải lên thì upload ảnh mới
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        imageURL = await uploadFileToFirebase(file);
      }

      // Gán lại các giá trị từ profile cũ nếu người dùng không nhập thông tin mới
      const updatedProfile = {
        userName: values.userName || profile?.userName,
        firstName: values.firstName || profile?.firstName,
        lastName: values.lastName || profile?.lastName,
        phoneNumber: values.phoneNumber || profile?.phoneNumber,
        email: values.email || profile?.email, // Người dùng bắt buộc nhập email nếu muốn cập nhật
        address: values.address || profile?.address,
        gender:
          values.gender === undefined
            ? profile?.gender === "Male"
              ? true
              : false
            : values.gender === "Male"
            ? true
            : false,
        imageURL, // Dùng URL ảnh mới nếu có, nếu không lấy từ profile cũ
      };

      // Gửi request cập nhật profile
      await api.put("User/update-profile", updatedProfile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Lấy lại thông tin profile đã cập nhật và điều hướng về trang profile
      fetchProfile();
      navigate("/profile", { state: { updateProfileSuccess: true } });
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
        <SlidebarProfile />

        <motion.section
          className="flex-1 bg-white dark:bg-gray-900"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          style={backgroundStyle}
        >
          <header className="bg-white dark:bg-gray-800 shadow  bg-gradient-to-br from-blue-50 to-blue-400">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Profile
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleDarkModeSwitch}
                  />
                  <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Avatar>
                  <AvatarImage
                    src={profile?.imageURL}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form
                  layout="vertical"
                  initialValues={profile}
                  onFinish={handleUpdateProfile}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Avatar" name="imageURL">
                          <Upload
                            listType="picture-circle"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={() => false}
                          >
                            {fileList.length >= 1 ? null : uploadButton}
                          </Upload>
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Username" name="userName">
                          <Input
                            placeholder={profile?.userName || "Enter username"}
                            prefix={<UserOutlined className="text-gray-400" />}
                            className="rounded-md"
                          />
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="First Name" name="firstName">
                          <Input
                            placeholder={
                              profile?.firstName || "Enter first name"
                            }
                            prefix={<AuditOutlined className="text-gray-400" />}
                            className="rounded-md"
                          />
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Last Name" name="lastName">
                          <Input
                            placeholder={profile?.lastName || "Enter last name"}
                            prefix={<AuditOutlined className="text-gray-400" />}
                            className="rounded-md"
                          />
                        </Form.Item>
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Phone Number" name="phoneNumber">
                          <Input
                            placeholder={
                              profile?.phoneNumber || "Enter phone number"
                            }
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            className="rounded-md"
                          />
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Email" name="email">
                          <Input
                            placeholder={profile?.email || "Enter email"}
                            prefix={<MailOutlined className="text-gray-400" />}
                            className="rounded-md"
                            disabled
                          />
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Address" name="address">
                          <Input
                            placeholder={profile?.address || "Enter address"}
                            prefix={<AimOutlined className="text-gray-400" />}
                            className="rounded-md"
                          />
                        </Form.Item>
                      </motion.div>
                      <motion.div variants={formItemVariants}>
                        <Form.Item label="Gender" name="gender">
                          <Select
                          // placeholder={profile?.gender || "Enter gender"}
                          >
                            <Select.Option value="Male">Male</Select.Option>
                            <Select.Option value="Female">Female</Select.Option>
                          </Select>
                        </Form.Item>
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className="flex justify-end space-x-4"
                    variants={formItemVariants}
                  >
                    <Button variant="outline" asChild>
                      <Link to="/profile">Cancel</Link>
                    </Button>
                    <Button htmlType="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </motion.div>
                </Form>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default UpdateProfile;
