import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import Home from "./pages/home/home";
import Booking from "./pages/booking/Booking";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import UpdateProfile from "./pages/updateProfile/updateProfile";
import AdminDashbroad from "./pages/adminDashbroad/adminDashbroad";
import OverviewPage from "./pages/OverviewPage/overView";
import Service from "./pages/ServicePage/service";
import UsersPage from "./pages/UsersManagePage/Users";
import SchedulesMPage from "./pages/SchedulesMPage/SchedulesMPage";
import SchedulesV from "./pages/SchedulerVet";
import AllService from "./pages/AllService/allService";
import ErrorBoundary from "./errorBoudary";
import { registerLicense } from "@syncfusion/ej2-base";
import "./index.css";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import SettingsPage from "./pages/settingpage/setting";
import FishPrescription from "./pages/prescriptions/prescription";
import { Toaster } from "sonner";
import History from "./pages/History/history";
import Process from "./pages/bookingProcess/bookingProcess";
import AppointmentDetail from "./pages/Detail Appointment Page/detailAp";
import ProfilePage from "./pages/profile/profile"; // Import your PrivateRoute component
import PrivateRoute from "./Routes/PrivateRoute";
import FeedbackForm from "./pages/FeedBack/feedBack";
import AboutUs from "./pages/About Us/aboutUs";
import ContactUs from "./pages/Contact Us/contactUs";
import PaymentSuccessful from "./pages/SuccessPayment/paymentSuccess";
import PaymentFailed from "./pages/FailedPayment/failedPayment";

// Add your license key here
registerLicense("Your_License_Key_Here");

function App() {
  return (
    <Router>
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{ className: "toasts" }}
      />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<AllService />} />
        <Route path="/service" element={<Service />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        {/* Private Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/updateProfile"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute requiredRoles={["Customer"]}>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/paymentsuccess/:bookingID"
          element={
            <PrivateRoute requiredRoles={["Customer"]}>
              <PaymentSuccessful />
            </PrivateRoute>
          }
        />
        <Route
          path="/paymentfailed"
          element={
            <PrivateRoute requiredRoles={["Customer"]}>
              <PaymentFailed />
            </PrivateRoute>
          }
        />
        <Route
          path="/process"
          element={
            <PrivateRoute>
              <Process />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback/:bookingID"
          element={
            <PrivateRoute requiredRoles={["Customer"]}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/detail"
          element={
            <PrivateRoute requiredRoles={["Vet"]}>
              <AppointmentDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <AdminDashbroad />
            </PrivateRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <OverviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedbackmanager"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <SchedulesMPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedulesV"
          element={
            <PrivateRoute requiredRoles={["Vet", "Customer"]}>
              <SchedulesV />
            </PrivateRoute>
          }
        />
        <Route
          path="/prescription"
          element={
            <PrivateRoute requiredRoles={["Vet"]}>
              <FishPrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <UsersPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorBoundary />} />
      </Routes>
    </Router>
  );
}

export default App;
