import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import Home from "./pages/home/home";
import Register from "./pages/Sercurity/register";
import Login from "./pages/Sercurity/login";
import UpdateProfile from "./pages/updateProfile/updateProfile";
import Service from "./pages/AllService/service";
import UsersPage from "./pages/UsersManagePage/Users";
import SchedulesMPage from "./pages/SchedulesMPage/SchedulesMPage";
import AllService from "./pages/AllService/allService";
import { registerLicense } from "@syncfusion/ej2-base";
import "./index.css";
import FishPrescription from "./pages/prescriptions/prescription";
import { Toaster } from "sonner";
import AppointmentDetail from "./pages/Detail Appointment Page/detailAp";
import ProfilePage from "./pages/profile/profile"; // Import your PrivateRoute component
import PrivateRoute from "./Routes/PrivateRoute";
import FeedbackForm from "./pages/FeedBack/feedBack";
import AboutUs from "./pages/About Us/aboutUs";
import ContactUs from "./pages/Contact Us/contactUs";
import PaymentSuccessful from "./pages/SuccessPayment/paymentSuccess";
import PaymentFailed from "./pages/FailedPayment/failedPayment";
import VetCalendar from "./pages/SchedulerVet";
import BookMPage from "./pages/Booking/bookingM";
import BookingPage from "./pages/Booking/Booking";
import DetailBooking from "./pages/Booking/DetailBooking";
import ChangePassword from "./pages/Sercurity/ChangePassword";
import DetailService from "./pages/AllService/DetailService";
import FeedbackManagement from "./pages/FeedBack/FeedbackMPage";
import EmailConfirmation from "./pages/Sercurity/EmailConfirmation";
import BookingCus from "./pages/Booking/BookingCus";

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
        <Route path="/reset-password" element={<ChangePassword />} />
        <Route path="/services" element={<AllService />} />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/detail-service/:serviceId" element={<DetailService />} />
        <Route path="/emailConfirmation" element={<EmailConfirmation />} />
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
            <PrivateRoute requiredRoles={["Customer"]}>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookingCus"
          element={
            <PrivateRoute requiredRoles={["Customer"]}>
              <BookingCus />
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
          path="/detailB/:bookingID"
          element={
            <PrivateRoute>
              <DetailBooking />
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
          path="/feedbackmanager"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <FeedbackManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/service"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <Service />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <PrivateRoute requiredRoles={["Manager"]}>
              <SchedulesMPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute requiredRoles={["Manager", "Staff"]}>
              <BookMPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedulesV"
          element={
            <PrivateRoute requiredRoles={["Vet"]}>
              <VetCalendar />
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
            <PrivateRoute requiredRoles={["Manager"]}>
              <UsersPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
