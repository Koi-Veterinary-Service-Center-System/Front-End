import { Link } from "react-router-dom";
import "./footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Company info */}
        <div className="footer-section">
          <h4 className="footer-logo">KoiNe</h4>
          <p className="footer-text">
            Sed viverra eget fames sit varius. Pellentesque mattis libero
            viverra dictumst ornare sed justo convallis vitae.
          </p>
          <div className="social-icons">
            <Link to="/">
              <i className="bx bxl-facebook-circle"></i>
            </Link>
            <Link to="/">
              <i className="bx bxl-instagram-alt"></i>
            </Link>

            <Link to="/">
              <i className="bx bxl-twitter"></i>
            </Link>
            <Link to="https://www.youtube.com/@thefishdoctor8746">
              <i className="bx bxl-youtube"></i>
            </Link>
          </div>
        </div>

        {/* Middle Sections: Company links */}
        <div className="footer-section">
          <h5>Company</h5>
          <ul className="footer-links">
            <li>
              <Link to="/">About Us</Link>
            </li>
            <li>
              <Link to="/">Blog</Link>
            </li>
            <li>
              <Link to="/">Gift Cards</Link>
            </li>
            <li>
              <Link to="/">Careers</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Useful Links</h5>
          <ul className="footer-links">
            <li>
              <Link to="/">New Products</Link>
            </li>
            <li>
              <Link to="/">Best Sellers</Link>
            </li>
            <li>
              <Link to="/">Discount</Link>
            </li>
            <li>
              <Link to="/">F.A.Q</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Customer Service</h5>
          <ul className="footer-links">
            <li>
              <Link to="/">Contact Us</Link>
            </li>
            <li>
              <Link to="/">Fish Service</Link>
            </li>
            <li>
              <Link to="/">Returns</Link>
            </li>
            <li>
              <Link to="/">Order Tracking</Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Store info */}
        <div className="footer-section">
          <h5>Store</h5>
          <p>
            8592 Fairground St.
            <br />
            Tallahassee, FL 32303
          </p>
          <p>+84 087-786-7896</p>
          <p>rgarton@outlook.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Copyright Pet Shop 2024. Design by Figma.guru</p>
        <div className="payment-icons">
          <i className="bx bxl-visa"></i>
          <i className="bx bxl-paypal"></i>
          <i className="bx bxl-mastercard"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
