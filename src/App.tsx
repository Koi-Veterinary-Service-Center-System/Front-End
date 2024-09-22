import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Booking from "./pages/booking/Booking";
import Profile from "./pages/updateProfile/updateProfile";
import UpdateProfile from "./pages/updateProfile/updateProfile";
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
      path: "/updateProfile",
      element: <UpdateProfile />,
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
