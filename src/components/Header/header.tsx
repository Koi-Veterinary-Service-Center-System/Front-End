import "./header.scss";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect

function Header() {
  const { Search } = Input;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    }
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
              <Link to="/shop">Shop</Link>
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
          <Link to="/favorites" className="heart-icon" data-count="0">
            <i className="bx bx-heart"></i>
          </Link>
          <Link to="/cart" className="cart-icon" data-count="2">
            <i className="bx bx-cart"></i>
          </Link>
          <div>
            {isLoggedIn ? (
              <div className="user-profile-dropdown">
                <div className="user-icon">
                  <i className="bx bx-user"></i>
                  <i className="ion-chevron-down"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile">
                        <Button>View Profile</Button>
                      </Link>
                    </li>
                    <li>
                      <Button onClick={handleLogout}>Logout</Button>
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
                      <Link to="/login#login-container">
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
