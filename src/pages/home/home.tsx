import Banner from "../../components/banner";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";

import "./home.scss";
import { Link } from "react-router-dom";

function Home() {
  const categories = [
    {
      name: "Accessories",
      products: 84,
      image:
        "https://i.pinimg.com/564x/8f/b7/53/8fb75367b0cd9eaf008dc58e9520ff83.jpg",
    },
    {
      name: "Food",
      products: 64,
      image:
        "https://i.pinimg.com/564x/0c/c3/a2/0cc3a2106f506efb2aaeb216e950c8e7.jpg",
    },
    {
      name: "Furniture",
      products: 22,
      image:
        "https://i.pinimg.com/236x/d5/5b/37/d55b3785eb7c4489b58e67d25f223390.jpg",
    },
    {
      name: "Bags",
      products: 16,
      image:
        "https://i.pinimg.com/564x/ea/e5/38/eae5381c66206ed0f3d883c8df9f2f47.jpg",
    },
  ];

  return (
    <div>
      <Header />
      <Banner />

      <div className="category-section">
        <h3>Browse by category</h3>
        <div className="category-container">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
              <div className="category-info">
                <h4>{category.name}</h4>
                <p>{category.products} products</p>
                <Link to="#" className="arrow-link">
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="category-arrows">
          <button className="arrow-button left">
            <i className="bx bx-left-arrow-alt"></i>
          </button>
          <button className="arrow-button right">
            <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
      <div className="veterinarian-section">
        <h2>Veterinarian</h2>
        <div className="veterinarian-cards">
          <div className="vet-card">
            <img
              src="https://i.pinimg.com/564x/d0/d8/aa/d0d8aaf4c5a076a6adcc5a2c3ec17637.jpg"
              alt="John Wick"
              className="vet-image"
            />
            <div className="vet-info">
              <h4>John Wick</h4>
              <p>4 years experience</p>
              <i className="heart-icon">❤</i>
            </div>
          </div>
          <div className="vet-card">
            <img
              src="https://i.pinimg.com/236x/9b/c0/ce/9bc0ceb83d86f8767d2f02151de1ee7c.jpg"
              alt="Emily Carter"
              className="vet-image"
            />
            <div className="vet-info">
              <h4>Emily Carter</h4>
              <p>5 years experience</p>
              <i className="heart-icon">❤</i>
            </div>
          </div>
          <div className="vet-card">
            <img
              src="https://i.pinimg.com/564x/08/99/c7/0899c70a16e0be0c6f2f7dbdf4ab994d.jpg"
              alt="Isabella Turner"
              className="vet-image"
            />
            <div className="vet-info">
              <h4>Isabella Turner</h4>
              <p>3 years experience</p>
              <i className="heart-icon">❤</i>
            </div>
          </div>
        </div>
      </div>

      <div className="koi-service-section">
        <div className="koi-service">
          <div className="koi-service-image">
            <img src="src\assets\images\homeimage.png" alt="Koi Service" />
          </div>
          <div className="koi-text">
            <h4>Koi Service</h4>
            <h1>The smarter way to shop for your Koi</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur. At et vehicula sodales est
              proin turpis pellentesque sinulla a aliquam amet rhoncus quisque
              eget sit.
            </p>
            <button className="koi-button">Learn More</button>
          </div>
        </div>
      </div>

      <div className="news-blog-section">
        <h2>News & Blog</h2>
        <div className="news-cards">
          <div className="news-card">
            <img
              src="https://cafishvet.com/wp-content/uploads/2024/09/Ultrasound-Jessie-Sanders-Fish-Vetranarian-1024x683.jpg"
              alt="News 1"
            />
            <div className="news-info">
              <span className="news-tag">News</span>
              <p className="news-date">24 May, 2024</p>
              <h4>Urna Cras Et Mauris Congue Nunc Nisi Nec Tempus Cursus</h4>
            </div>
          </div>
          <div className="news-card">
            <img
              src="https://cafishvet.com/wp-content/uploads/2020/10/mobile-fish-vet-car-4-3-1024x768.jpg"
              alt="News 2"
            />
            <div className="news-info">
              <span className="news-tag">News</span>
              <p className="news-date">24 May, 2024</p>
              <h4>Id Tellus Dignissim Eu Nisl Aliquam. Massa Id Interdum</h4>
            </div>
          </div>
          <div className="news-card">
            <img
              src="https://cafishvet.com/wp-content/uploads/2024/09/How-to-clean-your-koi-pond-filters-the-RIGHT-way-300x251.png"
              alt="News 3"
            />
            <div className="news-info">
              <span className="news-tag">News</span>
              <p className="news-date">24 May, 2024</p>
              <h4>Mus Cursus Pellentesque Blandit Tortor Suspendisse Ornare</h4>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
