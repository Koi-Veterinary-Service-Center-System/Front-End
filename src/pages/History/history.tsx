import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import api from "../../configs/axios";
import { Booking, koiOrPool, profile } from "../../types/info";
import {
  Fish,
  Pencil,
  Trash2,
  Waves,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Plus,
  Download,
  ChevronLeft,
  Moon,
  Sun,
  MessageSquare,
  Store,
  User,
  CalendarClock,
} from "lucide-react";
import { Checkbox, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import ModalDelete from "@/components/ModalDelete/ModalDelete/ModalDelete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const History = () => {
  const [profile, setProfile] = useState<profile | null>(null);
  const [koiOrPool, setKoiOrPool] = useState<koiOrPool[] | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoiOrPool, setCurrentKoiOrPool] = useState<koiOrPool | null>(
    null
  );
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]); // Changed to array
  const [totalFishKoi, setTotalFishKoi] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  // Fetch all booking and calculate totals
  const fetchBooking = async (userId?: string) => {
    try {
      const response = await api.get(`/booking/view-booking-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });
      const fetchedBookings = response.data;
      setBookings(fetchedBookings);

      setTotalBookings(fetchedBookings.length);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch bookings data";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchKoiOrPool = async (userId?: string) => {
    try {
      const response = await api.get(`/koi-or-pool/all-customer-koi-pool`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId },
      });

      const fetchedKoiOrPool = response.data;
      setKoiOrPool(fetchedKoiOrPool);

      // Calculate the total count of fish and pools
      const totalFishKoiCount = fetchedKoiOrPool.length;
      setTotalFishKoi(totalFishKoiCount);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch koi or pool data";
      setError(errorMessage);
      toast.error(errorMessage);
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile data";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Call fetchBooking in useEffect
  useEffect(() => {
    fetchProfile();
    fetchKoiOrPool();
    fetchBooking(); // Fetch bookings with user ID
  }, []);

  // Memoize the booking totals to avoid recalculating them unnecessarily
  const bookingSummary = useMemo(
    () => ({
      totalBookings,
    }),
    [totalBookings]
  );

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handleUpdateFishOrPool = (kOP: koiOrPool) => {
    setCurrentKoiOrPool(kOP);
    setIsModalOpen(true);
    form.setFieldsValue(kOP);
  };

  const handleCloseModal = () => {
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
      fetchKoiOrPool(profile?.userId);
      form.resetFields();
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update Koi or Pool";
      setError(errorMessage);
      toast.error(errorMessage);
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
    setCurrentKoiOrPool(selectedItem || null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = async () => {
    setIsDeleteModalOpen(false);
    fetchKoiOrPool();
    toast.success("Successfully deleted Fish or Pool!");
  };

  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isDarkMode ? "dark" : ""}`}>
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
                    activeMenuItem === "profile"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("profile")}
                >
                  <User className="h-5 w-5" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "history"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("history")}
                >
                  <Store className="h-5 w-5" />
                  <span>Service History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "process"
                      ? "bg-blue-400 text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                  }`}
                  onClick={() => handleMenuItemClick("process")}
                >
                  <CalendarClock className="h-5 w-5" />
                  <span>Service Process</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/message"
                  className={`flex items-center space-x-2 p-2 ${
                    activeMenuItem === "message"
                      ? "bg-blue-400 text-primary-foreground"
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

        <main className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Services
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
                  <AvatarFallback>
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Fish & Koi
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFishKoi}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Booking
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookingSummary.totalBookings}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Money
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,543</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Date Booking</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.bookingDate}>
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <Avatar>
                                <AvatarImage
                                  src={profile?.imageURL}
                                  alt="User"
                                />
                                <AvatarFallback>
                                  {profile?.firstName?.[0]}
                                  {profile?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {profile?.firstName} {profile?.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-2">{booking.bookingDate}</td>
                          <td className="py-2">
                            {booking.bookingStatus.toLowerCase() ===
                            "completed" ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {booking.bookingStatus}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                                {booking.bookingStatus}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Fish And Pools</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {!koiOrPool || koiOrPool.length === 0 ? (
                    <p>No fish or pools found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {koiOrPool.map((kOP) => (
                        <li
                          key={kOP.koiOrPoolID}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                              {kOP.isPool ? (
                                <Waves className="w-5 h-5 mr-2 text-blue-500" />
                              ) : (
                                <Fish className="w-5 h-5 mr-2 text-orange-500" />
                              )}
                              {kOP.name}
                            </h3>
                            <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {kOP.isPool ? "Pool" : "Koi"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {kOP.description}
                          </p>
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
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Modal
        open={isModalOpen}
        title="Update Koi Or Pool"
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Name Your Fish Or Pool"
            name="name"
            rules={[
              { required: true, message: "Please input a name!" },
              { min: 2, message: "Name must be at least 2 characters long!" },
              { max: 50, message: "Name cannot exceed 50 characters!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Is this a Pool?"
            name="isPool"
            valuePropName="checked"
          >
            <Checkbox>Pool</Checkbox>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please provide a description!" },
              {
                min: 10,
                message: "Description must be at least 10 characters!",
              },
              {
                max: 500,
                message: "Description cannot exceed 500 characters!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {isDeleteModalOpen && currentKoiOrPool && (
        <ModalDelete
          koiOrPoolID={currentKoiOrPool.koiOrPoolID}
          onDeleteSuccess={handleDeleteSuccess}
          onClose={handleCloseModalDL}
        />
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default History;
