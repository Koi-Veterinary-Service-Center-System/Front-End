import React from "react";
import { motion } from "framer-motion";
import { Fish, Droplet, Users, Phone, Award, Clock, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { Link } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const services = [
  {
    icon: Fish,
    title: "Koi Health Check-ups",
    description:
      "Comprehensive health assessments and tailored treatments for your koi, ensuring their longevity and vitality.",
  },
  {
    icon: Droplet,
    title: "Water Quality Management",
    description:
      "Advanced analysis and maintenance of your pond's ecosystem, optimizing water conditions for koi health.",
  },
  {
    icon: Users,
    title: "Expert Consultation",
    description:
      "Personalized advice on koi care, pond management, and aquatic ecosystem balance from our seasoned professionals.",
  },
  {
    icon: Award,
    title: "Specialized Treatments",
    description:
      "Cutting-edge therapies and medications for various koi health issues, backed by the latest aquatic veterinary research.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description:
      "Round-the-clock support for urgent koi health concerns, ensuring peace of mind for pond owners.",
  },
  {
    icon: Heart,
    title: "Preventive Care Programs",
    description:
      "Customized preventive care plans to maintain optimal health and prevent common koi diseases.",
  },
];

const team = [
  {
    img: "src/assets/images/chu.png",
    name: "Dr. Chu Lu",
    role: "Lead Veterinarian",
    bio: "With over 15 years of experience in koi health, Dr. Lu specializes in rare koi diseases and innovative treatment methods.",
  },
  {
    img: "src/assets/images/khoa.jpg",
    name: "Marc Spector",
    role: "Aquatic Specialist",
    bio: "Marc's expertise in aquatic ecosystems ensures that your pond provides the ideal environment for your koi to thrive.",
  },
  {
    img: "src/assets/images/phuongAn.jpg",
    name: "An Ngau Det",
    role: "Pond Ecosystem Expert",
    bio: "An's holistic approach to pond management integrates cutting-edge technology with traditional wisdom for optimal results.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.section
          className="mb-16 text-white text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Koi Veterinary Services
          </h1>
          <p className="text-xl mb-8">
            Dedicated to the health and beauty of your aquatic companions
          </p>
          <motion.div
            className="w-24 h-1 bg-white mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <Card className="bg-white bg-opacity-90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-800">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                At Koi Veterinary Services, we are passionate about preserving
                the beauty and health of your koi. Our team of expert
                veterinarians and aquatic specialists combines years of
                experience with cutting-edge technology to provide unparalleled
                care for your aquatic pets and their ecosystems. We believe in a
                holistic approach that not only treats ailments but also focuses
                on prevention and long-term well-being.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Our Comprehensive Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white bg-opacity-90 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <service.icon className="w-6 h-6 mr-2" />
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Meet Our Expert Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="h-full bg-white bg-opacity-90 backdrop-blur-lg hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-500"
                    />
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-center">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <Card className="bg-white bg-opacity-90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Phone className="w-6 h-6 mr-2" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Whether you need to schedule a consultation, have questions
                about our services, or are facing an aquatic emergency, our team
                is ready to assist you. We're committed to providing prompt,
                professional, and compassionate care for your koi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  <Link to="/emergency">24/7 Emergency Line</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
