"use client";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../configs/axios";
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
import {
  ChevronLeft,
  MessageSquare,
  Moon,
  Store,
  Sun,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UpdateProfile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

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

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        imageURL = await uploadFileToFirebase(file);
      }

      const updatedProfile = {
        ...values,
        gender: values.gender === "Male" ? true : false,
        imageURL,
      };

      await api.put("User/update-profile", updatedProfile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchProfile();
      navigate("/profile", { state: { updateProfileSuccess: true } });
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
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
        <motion.aside
          className="w-64 bg-gray-100 dark:bg-gray-800 h-screen sticky top-0"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          <div className="p-4">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <User className="h-6 w-6" />
              <span className="text-xl font-bold">Profile</span>
            </Link>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "dashboard"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("dashboard")}
                >
                  <User className="h-5 w-5" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "my-store"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("my-store")}
                >
                  <Store className="h-5 w-5" />
                  <span>Service History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/message"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "message"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("message")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Message</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-4 left-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </motion.aside>

        <motion.section
          className="flex-1 bg-white dark:bg-gray-900"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <header className="bg-white dark:bg-gray-800 shadow">
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
                  <AvatarImage src={profile?.imageURL} alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
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
                          <Input
                            placeholder={profile?.gender || "Enter gender"}
                            className="rounded-md"
                          />
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
      <Toaster />
    </div>
  );
}

export default UpdateProfile;
