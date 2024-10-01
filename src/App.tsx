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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
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
