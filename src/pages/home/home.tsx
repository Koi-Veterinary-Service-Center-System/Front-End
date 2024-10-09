"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FloatButton, Button } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import Banner from "../../components/banner";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import "./home.scss";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function AnimatedSection({ children }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.loginSuccess) {
        toast.success("Login successful!");
        window.history.replaceState({}, document.title);
      } else if (location.state.registerSuccess) {
        toast.success("Register successful!");
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

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
        "https://i.pinimg.com/564x/e6/8a/22/e68a2226770084e96215024e0599a049.jpg",
    },
  ];

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer koi pond consultations, treatments, and home visits.",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment through our website under the 'Services' section.",
    },
    {
      question: "What are your operating hours?",
      answer: "We operate from 9 AM to 6 PM, Monday to Saturday.",
    },
    {
      question: "Do you provide emergency services?",
      answer:
        "Yes, we provide emergency services. Contact our hotline for urgent cases.",
    },
  ];

  const toggleChatBox = () => {
    setIsChatBoxVisible(!isChatBoxVisible);
  };

  return (
    <div>
      <Header />
      <Banner />

      <AnimatedSection>
        <div className="category-section">
          <motion.div className="category-arrows" variants={fadeInUp}>
            <h3>Browse by category</h3>
            <div className="category-narrow">
              <button className="arrow-button left">
                <i className="bx bx-left-arrow-alt"></i>
              </button>
              <button className="arrow-button right">
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </motion.div>
          <div className="category-container">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="category-card"
                variants={fadeInUp}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="veterinarian-section">
          <motion.h2 variants={fadeInUp}>Veterinarian</motion.h2>
          <div className="veterinarian-cards">
            {[
              {
                name: "Richmond Loh",
                experience: "6 years experience",
                image:
                  "https://th.bing.com/th/id/R.00fbc210500b3738bf7c5860480113eb?rik=Pt18rX8ZnHdXNQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-uYTYcoORWoA%2fUokUjNBpt1I%2fAAAAAAAABs0%2fmW6Q3qgiXfI%2fs1600%2f1391477_577843652264588_1820292808_n.jpg&ehk=eW5Y6MhUcG2lC7%2fHzKqjtYCQmYR1I5EV%2fpx0Dd7c4N8%3d&risl=&pid=ImgRaw&r=0",
              },
              {
                name: "Emily Carter",
                experience: "5 years experience",
                image:
                  "https://i.pinimg.com/236x/9b/c0/ce/9bc0ceb83d86f8767d2f02151de1ee7c.jpg",
              },
              {
                name: "Isabella Turner",
                experience: "3 years experience",
                image:
                  "https://img.freepik.com/premium-photo/portrait-female-cute-asia-doctor-medical-coat-standing-isolated-white-background_1000819-2116.jpg?w=826",
              },
            ].map((vet, index) => (
              <motion.div key={index} className="vet-card" variants={fadeInUp}>
                <img src={vet.image} alt={vet.name} className="vet-image" />
                <div className="vet-info">
                  <h4>{vet.name}</h4>
                  <p>{vet.experience}</p>
                  <i className="heart-icon">❤</i>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="koi-service-section">
          <div className="koi-service">
            <motion.div className="koi-service-image" variants={fadeInUp}>
              <img src="src/assets/images/homeimage.png" alt="Koi Service" />
            </motion.div>
            <motion.div className="koi-text" variants={fadeInUp}>
              <h4>Koi Service</h4>
              <h1>The smarter way to shop for your Koi</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur. At et vehicula sodales
                est proin turpis pellentesque sinulla a aliquam amet rhoncus
                quisque eget sit.
              </p>
              <button className="koi-button">Learn More</button>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="news-blog-section">
          <motion.h2 variants={fadeInUp}>News & Blog</motion.h2>
          <div className="news-cards">
            {[
              {
                image:
                  "https://cafishvet.com/wp-content/uploads/2024/09/Ultrasound-Jessie-Sanders-Fish-Vetranarian-1024x683.jpg",
                title:
                  "Aquatic Veterinary Services offers a wide-range of services for your aquatic pets.",
              },
              {
                image:
                  "https://cafishvet.com/wp-content/uploads/2020/10/mobile-fish-vet-car-4-3-1024x768.jpg",
                title: "We Come To Your Tank or Pond",
              },
              {
                image:
                  "https://cafishvet.com/wp-content/uploads/2024/09/How-to-clean-your-koi-pond-filters-the-RIGHT-way-300x251.png",
                title: "Cleaning Koi Pond Filters the Right Way",
              },
            ].map((news, index) => (
              <motion.div key={index} className="news-card" variants={fadeInUp}>
                <img src={news.image} alt={`News ${index + 1}`} />
                <div className="news-info">
                  <span className="news-tag">News</span>
                  <p className="news-date">24 May, 2024</p>
                  <h4>{news.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {isChatBoxVisible && (
          <motion.div
            className="faq-chat-box"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="faq-header">
              <h4>Frequently Asked Questions</h4>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={toggleChatBox}
                className="close-button"
              />
            </div>
            <div className="faq-content">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h5>{faq.question}</h5>
                  <p>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type="primary"
          style={{ insetInlineEnd: 94 }}
          onClick={toggleChatBox}
        />
        <FloatButton.BackTop visibilityHeight={0} />
      </FloatButton.Group>

      <Footer />
    </div>
  );
}

export default Home;
