import "./header.scss";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { profile } from "../../types/info";
import api from "../../configs/axios";
import { Bell, CalendarCheck2, Heart, Pill } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Header() {
  const { Search } = Input;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [profile, setProfile] = useState<profile | null>(null);
  const [isLoading, setLoading] = useState(false);
  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    }
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      try {
        setLoading(true);
        const response = await api.get("/User/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setProfile(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Optionally remove user info
    setIsLoggedIn(false); // Set logged-in state to false
    navigate("/login#login-container"); // Redirect to login page
  };

  const onSearch = (value: string) => {
    console.log("Searching for:", value);
  };

  return (
    <>
      <header className="header_hd">
        <Link to="/">
          <img src="src/assets/images/logo.png" alt="Koine logo" />
        </Link>

        <nav>
          <ul className="nav__links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/allservice">Serivces</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <Form className="search-bar-hd" onFinish={onSearch}>
          <Form.Item>
            <input type="text" placeholder="Search products..." />
          </Form.Item>
          <button>
            <i className="bx bx-search-alt"></i>
          </button>
        </Form>

        <div className="icons">
          <Link to="/prescription" className="heart-icon" data-count="0">
            <Pill />
          </Link>
          <Link to="/favorites" className="heart-icon" data-count="0">
            <Heart />
          </Link>
          <Link to="/cart" className="cart-icon" data-count="2">
            <Bell />
          </Link>
          <Link to="/schedulesV" className="cart-icon" data-count="2">
            <CalendarCheck2 />
          </Link>
          <div>
            {isLoggedIn ? (
              <div className="user-profile-dropdown">
                <div className="user-icon">
                  <Avatar className="bg-gray-500">
                    <AvatarImage src={profile?.imageURL} alt="Profile" />
                    <AvatarFallback>
                      {profile?.firstName?.[0]}
                      {profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <i className="ion-chevron-down"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile">
                        <Button className="btn-view">
                          <i className="bx bx-user-circle"></i>View Profile
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Button className="btn-logout" onClick={handleLogout}>
                        <i className="bx bxs-log-out-circle"></i>Logout
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="user-profile-dropdown">
                <div className="user-icon">
                  <i className="bx bx-user"></i>
                  <i className="ion-chevron-down"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/login">
                        <Button>Login</Button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/register#register-container">
                        <Button>Register</Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
