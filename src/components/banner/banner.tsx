import { Button } from "antd";
import { Link } from "react-router-dom";
import "./banner.scss";
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
          <Link to="/booking">Booking</Link>
        </Button>
        <Button>
          <Link to="/booking#section">Booking Service</Link>
        </Button>
      </div>
      <div className="koi-banner">
        <img src="src/assets/images/koibanner.png" alt="Koi Banner" />
      </div>
    </div>
  );
}

export default Banner;
