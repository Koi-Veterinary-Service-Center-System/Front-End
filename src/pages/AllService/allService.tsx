"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Team
        </motion.h1>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                name: "Nhat Nguyen",
                image: "src/assets/images/nhatNguyen.png",
              },
              { name: "Phuong An", image: "src/assets/images/phuongAn.jpg" },
              { name: "Bao Chu", image: "src/assets/images/chu.png" },
            ].map((person, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-2">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-semibold">{person.name}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/fish-tank-service-1024x536.jpg"
                alt="Pond Subsurface Suction"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">
                Pond Subsurface Suction
              </h2>
              <p className="mb-4">
                Our advanced pond subsurface suction technique allows for
                efficient cleaning and maintenance of your fish pond, ensuring a
                healthy environment for your aquatic pets.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/woman-with-koi-pond.jpg"
                alt="Pond Fish Pathology"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">
                Pond Fish Pathology
              </h2>
              <p className="mb-4">
                Our expert veterinarians specialize in pond fish pathology,
                providing comprehensive diagnoses and treatment plans for
                various fish diseases and conditions.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/Water-Treatment-Jessie-Sanders-Fish-Vetranarian-1024x683.jpg"
                alt="Aquatic Telemedicine Consult"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">
                Aquatic Telemedicine Consult
              </h2>
              <p className="mb-4">
                Get expert advice from our fish veterinarians through our
                convenient telemedicine consultations. We can assess your fish's
                health and provide guidance remotely.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/fish-online-training.jpg"
                alt="Aquatic Veterinary Consult"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">
                Aquatic Veterinary Consult
              </h2>
              <p className="mb-4">
                Our in-person aquatic veterinary consultations offer
                comprehensive examinations and personalized care plans for your
                fish, ensuring their optimal health and well-being.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/fish-Surgery.jpg"
                alt="Fish Surgery"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">Fish Surgery</h2>
              <p className="mb-4">
                Our skilled veterinarians perform delicate fish surgeries using
                state-of-the-art techniques and equipment, addressing a wide
                range of fish health issues.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <img
                src="src/assets/images/Fish-Surgery-1.jpg"
                alt="Fish Surgery"
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">Fish Surgery</h2>
              <p className="mb-4">
                From minor procedures to complex operations, our fish surgery
                services are designed to improve the health and quality of life
                for your aquatic pets.
              </p>
              <Button>Request Appointment</Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <img
            src="src/assets/images/good-water-quality-in-fish-tank-1024x536.jpg"
            alt="USDA Service Center"
            className="mx-auto mb-4"
          />
          <p className="text-sm text-gray-600">
            U.S. Department of Agriculture
          </p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
