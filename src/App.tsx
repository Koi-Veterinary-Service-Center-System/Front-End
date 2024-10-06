import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Booking from "./pages/booking/Booking";
import "./index.css";

import Process from "./pages/process/process";
import Profile from "./pages/profile/profile";
import UpdateProfile from "./pages/updateProfile/updateProfile";
import AdminDashbroad from "./pages/adminDashbroad/adminDashbroad";
import OverviewPage from "./pages/OverviewPage/overView";
import Service from "./pages/ServicePage/service";
import UsersPage from "./pages/UsersManagePage/Users";
import ErrorBoundary from "./errorBoudary";
import SchedulesMPage from "./pages/SchedulesMPage/SchedulesMPage";
import { registerLicense } from "@syncfusion/ej2-base";
import SchedulesV from "./pages/SchedulerVet";
import AllService from "./pages/AllService/allService";

// Add your license key here
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpR3xbf1x0ZFRHalhYTnRWUiweQnxTdEFiWX9dcXVRT2NcVUxyXA=="
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/allservice",
      element: <AllService />,
    },
    {
      path: "/booking",
      element: <Booking />,
    },

    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/updateProfile",
      element: <UpdateProfile />,
    },
    {
      path: "/process",
      element: <Process />,
    },
    {
      path: "/admin",
      element: <AdminDashbroad />,
    },
    {
      path: "/overview",
      element: <OverviewPage />,
    },
    {
      path: "/schedules",
      element: <SchedulesMPage />,
    },
    {
      path: "/schedulesV",
      element: <SchedulesV />,
    },
    {
      path: "/service",
      element: <Service />,
    },
    {
      path: "/users",
      element: <UsersPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
