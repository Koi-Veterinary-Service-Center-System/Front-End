import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./process.scss";
import api from "../../configs/axios"; // Assuming Axios is used for making requests
import { Button, Input } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

function Process() {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token if available
        },
      });
      setProfile(response.data); // Assuming the API response contains the profile data
    } catch (error) {
      setError(error.message || "Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle menu item click
  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  // Handle dark mode toggle
  const handleDarkModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className="`process-page ${isSidebarHidden ? 'hide-sidebar' : ''}`">
      <section id="sidebar">
        <Link to="#" className="brand">
          <i className="bx bxs-smile"></i>
          <span className="text">Profile</span>
        </Link>
        <ul className="side-menu top">
          <li className="activeMenuItem === 'dashboard' ? 'active' : ''">
            <Link
              to="/profile"
              onClick={() => handleMenuItemClick("dashboard")}
            >
              <i className="bx bxs-dashboard"></i>
              <span className="text">Your Profile</span>
            </Link>
          </li>
          <li className={activeMenuItem === "my-store" ? "active" : ""}>
            <Link to="#" onClick={() => handleMenuItemClick("my-store")}>
              <i className="bx bxs-shopping-bag-alt"></i>
              <span className="text">Service History</span>
            </Link>
          </li>
          <li className={activeMenuItem === "message" ? "active" : ""}>
            <Link to="#" onClick={() => handleMenuItemClick("message")}>
              <i className="bx bxs-message-dots"></i>
              <span className="text">Message</span>
            </Link>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <Button className="text" onClick={() => window.history.back()}>
              Back
            </Button>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          <i className="bx bx-menu"></i>

          <input
            type="checkbox"
            id="switch-mode"
            hidden
            checked={isDarkMode}
            onChange={handleDarkModeSwitch}
          />
          <label htmlFor="switch-mode" className="switch-mode"></label>

          <Link to="#" className="process">
            <img
              src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
              alt="process"
            />
          </Link>
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Profile</h1>
            </div>
            <Link to="#" className="btn-download">
              <i className="bx bxs-cloud-download"></i>
              <span className="text">Download PDF</span>
            </Link>
          </div>

          <ul className="box-info">
            <li>
              <i className="bx bxs-calendar-check"></i>
              <span className="text">
                <h3>1020</h3>
                <p>Appointment</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-group"></i>
              <span className="text">
                <h3>2834</h3>
                <p>Total Booking</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-dollar-circle"></i>
              <span className="text">
                <h3>$2543</h3>
                <p>Total Money</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Recent Orders</h3>
                <i className="bx bx-search"></i>
                <i className="bx bx-filter"></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date Order</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        alt="user"
                      />
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        alt="user"
                      />
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        alt="user"
                      />
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status process">Process</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        alt="user"
                      />
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        alt="user"
                      />
                      <p>John Doe</p>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="todo">
              <div className="head">
                <h3>Todos</h3>
                <i className="bx bx-plus"></i>
                <i className="bx bx-filter"></i>
              </div>
              <ul className="todo-list">
                <li className="completed">
                  <p>Todo List</p>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="completed">
                  <p>Todo List</p>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="not-completed">
                  <p>Todo List</p>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="completed">
                  <p>Todo List</p>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="not-completed">
                  <p>Todo List</p>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </section>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Process;
