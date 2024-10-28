import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FloatButton } from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import Banner from "../../components/banner";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "antd";

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

  const blogPosts = [
    {
      title: "Essential Koi Health Checks",
      description:
        "Regular health checks are critical to ensure your koi remain healthy and vibrant throughout the year.",
      image:
        "https://i.pinimg.com/564x/10/50/09/105009e291593ad674bc60faed37a5e8.jpg",
      link: "/blogs/essential-health-checks",
    },
    {
      title: "Feeding Guide for Koi Fish",
      description:
        "Learn about the best food options and feeding schedules to keep your koi well-nourished and happy.",
      image:
        "https://images.squarespace-cdn.com/content/v1/4f6c8d6ae4b08696a7443c8b/1548090687880-RY1LAPWKOHJI1CVZKQVN/ke17ZwdGBToddI8pDm48kE6hjPJFwgE64QmK6sQ9p9F7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USH0LmvCxVfRNSLd3yuAuevWbKmE5m_0Anl3xjVzBd37zwMy-Jd4qnWKZiGmV5bqqQ/koi-feeding.jpg",
      link: "/blogs/feeding-guide",
    },
    {
      title: "Setting up the Perfect Koi Pond",
      description:
        "A well-maintained pond is essential for koi fish to thrive. Learn the basics of pond setup and filtration.",
      image:
        "https://th.bing.com/th/id/OIP.UQLZNjhAK_qJQPD80aGfjAHaE8?rs=1&pid=ImgDetMain",
      link: "/blogs/koi-pond-setup",
    },
    {
      title: "Winter Care Tips for Koi",
      description:
        "Proper winter care ensures that your koi remain healthy and active even during the cold months.",
      image: "https://i.ytimg.com/vi/dnG5ccMJuss/maxresdefault.jpg",
      link: "/blogs/winter-care-tips",
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner />

      <AnimatedSection>
        <div className="space-y-8 m-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Veterinary Services Blog</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={fadeInUp}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{post.title}</h4>
                  <p className="text-gray-600">{post.description}</p>
                  <Link
                    to={post.link}
                    className="text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="space-y-8 m-5">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center"
          >
            Veterinarian
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={fadeInUp}
              >
                <img
                  src={vet.image}
                  alt={vet.name}
                  className="w-full h-96 object-contain"
                />
                <div className="p-4 relative">
                  <h4 className="font-semibold text-lg">{vet.name}</h4>
                  <p className="text-gray-600">{vet.experience}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="bg-blue-50 rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2">
              <img
                src="/src/assets/images/homeimage.png"
                alt="Koi Service"
                className="w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2 p-8 space-y-4">
              <h4 className="text-blue-600 font-semibold">Koi Service</h4>
              <h1 className="text-3xl font-bold">
                The smarter way to shop for your Koi
              </h1>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur. At et vehicula sodales
                est proin turpis pellentesque sinulla a aliquam amet rhoncus
                quisque eget sit.
              </p>
              <Button>Learn More</Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="space-y-8 m-5">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center"
          >
            News & Blog
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={fadeInUp}
              >
                <img
                  src={news.image}
                  alt={`News ${index + 1}`}
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 space-y-2">
                  <span className="text-blue-600 font-semibold">News</span>
                  <p className="text-gray-500 text-sm">24 May, 2024</p>
                  <h4 className="font-semibold text-lg"> {news.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {isChatBoxVisible && (
          <motion.div
            className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h4 className="font-semibold">Frequently Asked Questions</h4>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={toggleChatBox}
                className="close-button"
              />
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h5 className="font-semibold">{faq.question}</h5>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FloatButton Group */}
      <FloatButton.Group
        shape="circle"
        className="fixed bottom-4 right-4 space-y-2"
      >
        {/* FAQ Button */}
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type="primary"
          onClick={toggleChatBox}
          className="rounded-full"
        />
        {/* Back to Top Button */}
        <FloatButton.BackTop visibilityHeight={0} />
      </FloatButton.Group>

      <Footer />
    </div>
  );
}

export default Home;
