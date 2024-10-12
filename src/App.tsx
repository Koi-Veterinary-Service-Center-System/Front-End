import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop"; // Import ScrollToTop
import Home from "./pages/home/home";
import Booking from "./pages/booking/Booking";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
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
import FishPrescriptionSystem from "./pages/prescriptions/prescription";
import History from "./pages/History/history";
import Process from "./pages/bookingProcess/bookingProcess";
import AppointmentDetail from "./pages/Detail Appointment Page/detailAp";

// Add your license key here
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpR3xbf1x0ZFRHalhYTnRWUiweQnxTdEFiWX9dcXVRT2NcVUxyXA=="
);

// Main layout with ScrollToTop applied
function MainLayout() {
  return (
    <>
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{ className: "toasts" }}
      />
      <ScrollToTop /> {/* This ensures scroll reset on every route change */}
      <Outlet /> {/* Renders the selected route's component */}
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />, // Use MainLayout as the root element
      errorElement: <ErrorBoundary />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/allservice", element: <AllService /> },
        { path: "/booking", element: <Booking /> },
        { path: "/profile", element: <Profile /> },
        { path: "/updateProfile", element: <UpdateProfile /> },
        { path: "/history", element: <History /> },
        { path: "/process", element: <Process /> },
        { path: "/detail", element: <AppointmentDetail /> },
        { path: "/admin", element: <AdminDashbroad /> },
        { path: "/overview", element: <OverviewPage /> },
        { path: "/analytics", element: <AnalyticsPage /> },
        { path: "/settings", element: <SettingsPage /> },
        { path: "/schedules", element: <SchedulesMPage /> },
        { path: "/schedulesV", element: <SchedulesV /> },
        { path: "/prescription", element: <FishPrescriptionSystem /> },
        { path: "/prescription", element: <FishPrescription /> },
        { path: "/service", element: <Service /> },
        { path: "/users", element: <UsersPage /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
