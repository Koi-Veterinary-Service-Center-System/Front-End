import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./process.scss";
import api from "../../configs/axios"; // Assuming Axios is used for making requests

import { koiOrPool, profile } from "../../types/info";
import { Fish, Pencil, Trash2, Waves } from "lucide-react";

import { Checkbox, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import ModalDelete from "@/components/ModalDelete/ModalDelete/ModalDelete";
import { Button } from "@/components/ui/button";

function Process() {
  const [profile, setProfile] = useState<profile | null>(null);
  const [koiOrPool, setKoiOrPool] = useState<koiOrPool | null>(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [currentKoiOrPool, setCurrentKoiOrPool] = useState<koiOrPool | null>(
    null
  );
  const [form] = Form.useForm();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For the delete modal

  // Fetch the koi or pool data
  const fetchKoiOrPool = async (userId: string) => {
    try {
      const response = await api.get(`/koi-or-pool/all-customer-koi-pool`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if available
        },
        params: { userId }, // Pass the customerId as a query parameter
      });
      setKoiOrPool(response.data); // Update state with the fetched data
    } catch (error) {
      setError(error.message || "Failed to fetch koi or pool data");
    }
  };

  // Fetch the profile
  const fetchProfile = async () => {
    try {
      const response = await api.get("User/profile", {
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
    const loadData = async () => {
      await fetchProfile();
      if (profile?.userId) {
        await fetchKoiOrPool(profile.userId);
      }
    };
    loadData();
  }, [profile?.userId]);

  //Handle update profile

  const handleUpdateFishOrPool = (item: koiOrPool) => {
    setCurrentKoiOrPool(item); // Set the current item to be edited
    setIsModalOpen(true); // Open the modal
    form.setFieldsValue(item); // Populate the form with the selected item data
  };

  // Handle form submit (Update API call)
  const handleFormSubmit = async (values: koiOrPool) => {
    setLoading(true);
    try {
      // Update the koiOrPool with the correct ID and form values
      await api.put(
        `/koi-or-pool/update-koiorpool/${currentKoiOrPool?.koiOrPoolID}`,
        values,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchKoiOrPool(profile?.userId || ""); // Refresh the data after update
      form.resetFields(); // Reset form after successful submission
      setIsModalOpen(false); // Close modal after success
    } catch (error) {
      setError(error.message || "Failed to update Fish or Pool");
    } finally {
      setLoading(false);
    }
  };

  //Handle close modal
  const handelCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOpenDeleteModal = (koiOrPoolID: string) => {
    setCurrentKoiOrPool({ koiOrPoolID }); // Set only the koiOrPoolID to currentKoiOrPool
    setIsDeleteModalOpen(true); // Open the delete modal
  };

  const handleDeleteSuccess = () => {
    // Close the delete modal
    setIsDeleteModalOpen(false);
    // Refresh the list after successful deletion
    fetchKoiOrPool(customerId);
  };

  const handleCloseModalDL = () => {
    setIsDeleteModalOpen(false);
  };

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
    <div className={`process-page ${isDarkMode ? "dark-mode" : ""}`}>
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
            <Link to="#" onClick={() => handleMenuItemClick("my-store")}>
              <i className="bx bxs-shopping-bag-alt"></i>
              <span className="text">Service History</span>
            </Link>
          </li>
          <li className={activeMenuItem === "message" ? "active" : ""}>
            <Link to="#" onClick={() => handleMenuItemClick("message")}>
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

          <Link to="#" className="process">
            <img src={profile?.imageURL} alt="process" />
          </Link>
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Services</h1>
            </div>
            <Link to="#" className="btn-download">
              <i className="bx bxs-cloud-download"></i>
              <span className="text">Download PDF</span>
            </Link>
          </div>

          <ul className="box-info">
            <li>
              <i className="bx bxs-calendar-check"></i>
              <span className="text">
                <h3>1020</h3>
                <p>Appointment</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-group"></i>
              <span className="text">
                <h3>2834</h3>
                <p>Total Booking</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-dollar-circle"></i>
              <span className="text">
                <h3>$2543</h3>
                <p>Total Money</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Recent Orders</h3>
                <i className="bx bx-search"></i>
                <i className="bx bx-filter"></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date Booking</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src={profile?.imageURL} alt="user" />
                      <p>
                        {profile?.firstName} {profile?.lastName}
                      </p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                  </tr>
                  {/* More rows here */}
                </tbody>
              </table>
            </div>

            <div className="todo">
              <div className="head">
                <h3>Your Fish And Pools</h3>
                <i className="bx bx-plus"></i>
                <i className="bx bx-filter"></i>
              </div>
              <ul className="space-y-4">
                {koiOrPool?.map((item) => (
                  <li
                    key={item.koiOrPoolID}
                    className="bg-white rounded-lg shadow-md"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          {item.isPool ? (
                            <Waves className="w-5 h-5 mr-2 text-blue-500" />
                          ) : (
                            <Fish className="w-5 h-5 mr-2 text-orange-500" />
                          )}
                          {item.name}
                        </h3>
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {item.isPool ? "Pool" : "Koi"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateFishOrPool(item)} // Chỉnh sửa
                          className="flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleOpenDeleteModal(item.koiOrPoolID)
                          } // Mở modal xóa
                          className="flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>

                        <Modal
                          open={isModalOpen}
                          title="Create Koi Or Pool"
                          onCancel={handelCloseModal}
                          footer={null} // Custom footer will be handled by form buttons
                        >
                          <Form
                            form={form}
                            labelCol={{ span: 24 }}
                            onFinish={handleFormSubmit} // Handle form submission
                          >
                            <Form.Item
                              label="Name Your Fish Or Pool"
                              name="name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input a name!",
                                },
                                {
                                  min: 2,
                                  message:
                                    "Name must be at least 2 characters long!",
                                },
                                {
                                  max: 50,
                                  message: "Name cannot exceed 50 characters!",
                                },
                                {
                                  pattern: /^[^\s][a-zA-Z\s]+$/,
                                  message:
                                    "Name cannot start with a space or contain special characters",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            {/* Handling Checkbox */}
                            <Form.Item
                              label="Is this a Pool?"
                              name="isPool"
                              valuePropName="checked"
                              rules={[
                                {
                                  required: true,
                                  message: "Please insure that!!!",
                                },
                              ]}
                            >
                              <Checkbox>Pool</Checkbox>
                            </Form.Item>

                            <Form.Item
                              label="Description"
                              name="description"
                              rules={[
                                {
                                  required: true,
                                  message: "Please provide a description!",
                                },
                                {
                                  pattern: /^[^\s][a-zA-Z\s]+$/,
                                  message:
                                    "Description cannot start with a space or contain special characters",
                                },
                                {
                                  min: 10,
                                  message:
                                    "Description must be at least 10 characters!",
                                },
                                {
                                  max: 500,
                                  message:
                                    "Description cannot exceed 500 characters!",
                                },
                              ]}
                            >
                              <TextArea rows={4} />
                            </Form.Item>

                            {/* Form submit button */}
                            <Form.Item>
                              <Button
                                htmlType="submit"
                                loading={loading} // Add loading spinner during submission
                                style={{ width: "100%" }}
                              >
                                Submit
                              </Button>
                            </Form.Item>
                          </Form>
                        </Modal>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </section>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentKoiOrPool && (
        <ModalDelete
          koiOrPoolID={currentKoiOrPool?.koiOrPoolID} // Ensure this is correctly defined
          onDeleteSuccess={handleDeleteSuccess}
          onClose={handleCloseModalDL}
        />
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Process;
