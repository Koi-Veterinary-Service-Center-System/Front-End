import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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

function AnimatedSection({ children }) {
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

        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className={`relative w-full pt-[100%] ${member.color}`}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg filter"
                    />
                  </div>
                  <div className="p-6 text-center bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {[
              {
                title: "Pond Subsurface Suction",
                description:
                  "Our advanced pond subsurface suction technique allows for efficient cleaning and maintenance of your fish pond, ensuring a healthy environment for your aquatic pets.",
                image: "src/assets/images/fish-tank-service-1024x536.jpg",
              },
              {
                title: "Pond Fish Pathology",
                description:
                  "Our expert veterinarians specialize in pond fish pathology, providing comprehensive diagnoses and treatment plans for various fish diseases and conditions.",
                image: "src/assets/images/woman-with-koi-pond.jpg",
              },
              {
                title: "Aquatic Telemedicine Consult",
                description:
                  "Get expert advice from our fish veterinarians through our convenient telemedicine consultations. We can assess your fish's health and provide guidance remotely.",
                image:
                  "src/assets/images/Water-Treatment-Jessie-Sanders-Fish-Vetranarian-1024x683.jpg",
              },
              {
                title: "Aquatic Veterinary Consult",
                description:
                  "Our in-person aquatic veterinary consultations offer comprehensive examinations and personalized care plans for your fish, ensuring their optimal health and well-being.",
                image: "src/assets/images/fish-online-training.jpg",
              },
              {
                title: "Fish Surgery",
                description:
                  "Our skilled veterinarians perform delicate fish surgeries using state-of-the-art techniques and equipment, addressing a wide range of fish health issues.",
                image: "src/assets/images/fish-Surgery.jpg",
              },
              {
                title: "Advanced Fish Surgery",
                description:
                  "From minor procedures to complex operations, our fish surgery services are designed to improve the health and quality of life for your aquatic pets.",
                image: "src/assets/images/Fish-Surgery-1.jpg",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                    {service.title}
                  </h2>
                  <p className="mb-6 text-gray-600">{service.description}</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Request Appointment
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

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
