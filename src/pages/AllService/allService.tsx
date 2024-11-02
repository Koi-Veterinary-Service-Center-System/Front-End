import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/configs/axios";
import { FaClock, FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

interface Services {
  serviceID: string;
  serviceName: string;
  description: string;
  price: number;
  quantityPrice: number;
  estimatedDuration: number;
  imageURL: string;
}

function AnimatedServiceCard({
  service,
  index,
}: {
  service: Services;
  index: number;
}) {
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
      variants={fadeInUp}
      initial="hidden"
      animate={controls}
      custom={index}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative group">
        <img
          src={service.imageURL}
          alt={service.serviceName}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/detail-service/${service.serviceID}`}
            className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300"
            aria-label={`View details for ${service.serviceName}`}
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {service.serviceName}
        </h2>
        <p className="mb-6 text-gray-600">{service.description}</p>
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-2 text-blue-500" />
            <p>Price: {service.price.toLocaleString("vi-VN")} vnd</p>
          </div>
          <div className="flex items-center text-gray-600">
            <FaShoppingCart className="mr-2 text-blue-500" />
            <p>
              Quantity Price: {service.quantityPrice.toLocaleString("vi-VN")}{" "}
              vnd
            </p>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2 text-blue-500" />
            <p>Estimated Duration: {service.estimatedDuration} hours</p>
          </div>
        </div>
        <div className="mt-6">
          <Link to="/booking">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Request Appointment
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Skeleton className="w-full h-64" />
      <div className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <Skeleton className="h-10 w-full mt-6" />
      </div>
    </div>
  );
}

export default function Component() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await api.get(`/service/all-service`);
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error("API response is not an array");
        setServices([]);
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <ServiceSkeleton />
                </motion.div>
              ))
            : services.map((service, index) => (
                <AnimatedServiceCard
                  key={service.serviceID}
                  service={service}
                  index={index}
                />
              ))}
        </motion.div>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <img
            src="https://cafishvet.com/wp-content/uploads/2020/10/USDA-Accredited-Veterinarian.png"
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
