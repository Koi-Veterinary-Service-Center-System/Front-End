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
import { Toaster, toast } from "sonner";
const Process = () => {
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

  const fetchKoiOrPool = async (userId: string) => {
    try {
      const response = await api.get(`/koi-or-pool/all-customer-koi-pool`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });
      setKoiOrPool(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch koi or pool data");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("User/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile(); // Fetch profile on component mount
  }, []);

  useEffect(() => {
    fetchKoiOrPool(); // Only call if userId is available
  }, []); // Depend on profile to ensure we fetch the koi or pool data after profile is loaded

  useEffect(() => {
    console.log(koiOrPool); // Add this to inspect data
  }, [koiOrPool]);

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handleUpdateFishOrPool = (kOP: koiOrPool) => {
    setCurrentKoiOrPool(kOP);
    setIsModalOpen(true);
    form.setFieldsValue(kOP);
  };

  //Handle close modal
  const handelCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values: koiOrPool) => {
    if (!currentKoiOrPool || !currentKoiOrPool.koiOrPoolID) {
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/koi-or-pool/update-koiorpool/${currentKoiOrPool.koiOrPoolID}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Successfully updated Koi or Pool!");
      fetchKoiOrPool(profile?.userId || ""); // Refetch data after successful update
      form.resetFields(); // Reset form fields after successful update
      setIsModalOpen(false); // Close the modal after successful update
    } catch (error: any) {
      console.error("Update failed: ", error.response || error);
      setError(error.message || "Failed to update Koi or Pool");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModalDL = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = (koiOrPoolID: string) => {
    const selectedItem = koiOrPool?.find(
      (kOP) => kOP.koiOrPoolID === koiOrPoolID
    );
    console.log("Opening delete modal for:", koiOrPoolID, selectedItem);
    setCurrentKoiOrPool(selectedItem || null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = async () => {
    // Close the delete modal
    setIsDeleteModalOpen(false);

    // Fetch the updated list of Koi or Pool items

    fetchKoiOrPool(); // Refresh the list after deletion
    toast.success("Successfully deleted Fish or Pool!");
  };

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };
  return (
    <div className={`process-page ${isDarkMode ? "dark-mode" : ""}`}>
      <Toaster richColors position="top-right" />
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
                <p>Total Fish & Koi</p>
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
              {!koiOrPool || setCurrentKoiOrPool.length === 0 ? (
                <p>No fish or pools found.</p>
              ) : (
                <ul className="space-y-4">
                  {koiOrPool.map((kOP) => (
                    <li
                      key={kOP.koiOrPoolID}
                      className="bg-white rounded-lg shadow-md"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            {kOP.isPool ? (
                              <Waves className="w-5 h-5 mr-2 text-blue-500" />
                            ) : (
                              <Fish className="w-5 h-5 mr-2 text-orange-500" />
                            )}
                            {kOP.name}
                          </h3>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {kOP.isPool ? "Pool" : "Koi"}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{kOP.description}</p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateFishOrPool(kOP)}
                            className="flex items-center"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleOpenDeleteModal(kOP.koiOrPoolID)
                            }
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
                                    message:
                                      "Name cannot exceed 50 characters!",
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
              )}
            </div>
          </div>
        </main>
      </section>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentKoiOrPool && (
        <ModalDelete
          koiOrPoolID={currentKoiOrPool?.koiOrPoolID}
          onDeleteSuccess={handleDeleteSuccess}
          onClose={handleCloseModalDL}
        />
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Process;
