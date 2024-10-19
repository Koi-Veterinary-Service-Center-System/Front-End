import { motion } from "framer-motion";
import { Fish, Droplet, Users, Phone } from "lucide-react";
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

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
      <Header />

      <main className="container mx-auto px-4">
        <motion.section className="mb-16" {...fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>About Our Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                At Koi Veterinary Services, we are dedicated to providing
                exceptional care for your precious koi and maintaining the
                health of your ponds. With years of specialized experience, our
                team of expert veterinarians and aquatic specialists is
                committed to ensuring the well-being of your aquatic pets and
                the ecosystem they inhabit.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Fish,
                title: "Koi Health Check-ups",
                description:
                  "Regular health assessments and treatments for your koi",
              },
              {
                icon: Droplet,
                title: "Water Quality Management",
                description:
                  "Expert analysis and maintenance of your pond's ecosystem",
              },
              {
                icon: Users,
                title: "Consultation Services",
                description:
                  "Professional advice on koi care and pond management",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <service.icon className="w-6 h-6 mr-2 text-blue-500" />
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
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                img: "src/assets/images/chu.png",
                name: "Dr. Chu Lu",
                role: "Lead Veterinarian",
              },
              {
                img: "src/assets/images/khoa.jpg",
                name: "Marc Spector",
                role: "Aquatic Specialist",
              },
              {
                img: "src/assets/images/phuongAn.jpg",
                name: "An Ngau Det",
                role: "Pond Ecosystem Expert",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <img
                      src={member.img} // Make sure this path is correct
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-center">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 text-center">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="mb-16" {...fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-6 h-6 mr-2 text-blue-500" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Have questions or need to schedule a consultation? We're here to
                help!
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
