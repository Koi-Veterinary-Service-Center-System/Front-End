import { Button } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";
// Correctly import your SCSS file here

function Banner() {
  return (
    <div className="banner-section">
      <div className="right">
        <h1>Pet Shop</h1>
        <h3>If animals could talk, they'd talk about us!</h3>
        <p>
          At a vehicula est proin turpis pellentesque sinulla a aliquam amet
          rhoncus quisque eget sit
        </p>
        <Button className="fakeButton">
          <Link to="/booking#section">Booking Service</Link>
        </Button>
      </div>
      <div className="koi-banner">
        <img src="src/assets/images/bannerHome.png" alt="Koi Banner" />
      </div>
    </div>
  );
}

export default Banner;
