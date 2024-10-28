import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Button } from "@/components/ui/button"; // Assuming the Service type is correctly defined
import api from "@/configs/axios";
import { FaClock, FaDollarSign } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Services } from "@/types/info";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const teamMembers = [
  {
    name: "Phuong An",
    role: "Seller",
    image: "src/assets/images/phuongAn.jpg",
    color: "bg-yellow-400",
  },
  {
    name: "Nhat Nguyen",
    role: "Seller",
    image: "src/assets/images/nhatNguyen.png",
    color: "bg-teal-400",
  },
  {
    name: "Chu Lu",
    role: "Seller",
    image: "src/assets/images/chu.png",
    color: "bg-red-400",
  },
];

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
}

export default function AllService() {
  const [services, setServices] = useState<Services[]>([]); // Ensure it's typed correctly
  const [isLoading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch services from API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/service/all-service`);
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error("API response is not an array");
        setServices([]); // Default to empty array if not in expected format
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-5xl font-bold text-center mb-16 text-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading services...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.serviceID}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <div className="relative">
                  <img
                    src={service.imageURL}
                    alt={service.serviceName}
                    className="w-full h-64 object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button className="bg-white text-blue-600 hover:bg-blue-100">
                      View Details
                    </Button>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                    {service.serviceName}
                  </h2>
                  <p className="mb-6 text-gray-600">{service.description}</p>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <FaDollarSign className="mr-2 text-blue-500" />
                      <p>Price: ${service.price}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaShoppingCart className="mr-2 text-blue-500" />
                      <p>Quantity Price: ${service.quantityPrice}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-blue-500" />
                      <p>
                        Estimated Duration: {service.estimatedDuration} hours
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link to="/booking">Request Appointment</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <img
            src="src/assets/images/good-water-quality-in-fish-tank-1024x536.jpg"
            alt="USDA Service Center"
            className="mx-auto mb-4 rounded-lg shadow-lg"
          />
          <p className="text-sm text-gray-600">
            U.S. Department of Agriculture
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
