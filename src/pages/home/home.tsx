import Banner from "../../components/banner/banner";
import Footer from "../../components/Footer/footer";
import HeaderV2 from "../../components/HeaderNoLogin/headerv2";
import "./home.scss";

function Home() {
  return (
    <div>
      <HeaderV2 />
      <Banner />
      <Footer />
    </div>
  );
}

export default Home;
