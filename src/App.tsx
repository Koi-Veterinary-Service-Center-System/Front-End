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

// Add your license key here
registerLicense("Your_License_Key_Here");

function App() {
  const isAuthenticated = true; // Replace with your actual authentication logic

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
        <Route path="/allservice" element={<AllService />} />
        <Route path="/service" element={<Service />} />

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
          path="/process"
          element={
            <PrivateRoute>
              <Process />
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
          path="/analytics"
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
            <PrivateRoute requiredRoles={["Vet"]}>
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
