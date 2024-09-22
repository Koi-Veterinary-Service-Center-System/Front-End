import "./headerv2.scss";
import { Form, Input } from "antd";
import type { GetProps } from "antd";
import { Link } from "react-router-dom";
function HeaderV2() {
  type SearchProps = GetProps<typeof Input.Search>;

  const { Search } = Input;

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <>
      <header>
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

        <Form className="search-bar" onFinish={onSearch}>
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
          <Link to="/profile" className="user-icon">
            <i className="bx bx-user"></i>
          </Link>
        </div>
      </header>
    </>
  );
}

export default HeaderV2;
