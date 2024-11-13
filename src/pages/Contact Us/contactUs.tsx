import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Fish } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Get in Touch with Koi Care Experts
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.section {...fadeIn} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <Send className="mr-2" /> Send Us a Message
                </CardTitle>
                <CardDescription className="text-blue-100">
                  We're here to help with your koi fish concerns.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={staggerChildren}>
                    {["name", "email", "message"].map((field) => (
                      <motion.div key={field} className="space-y-2">
                        <Label
                          htmlFor={field}
                          className="text-blue-700 font-medium"
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Label>
                        {field === "message" ? (
                          <Textarea
                            id={field}
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            rows={4}
                          />
                        ) : (
                          <Input
                            id={field}
                            name={field}
                            type={field === "email" ? "email" : "text"}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-100 text-green-700 p-3 rounded-md"
                      >
                        Thank you for your message! We'll get back to you soon.
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors duration-300"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section {...fadeIn} transition={{ delay: 0.4 }}>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <Fish className="mr-2" /> Koi Care Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.div variants={staggerChildren} className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      text: "123 Koi Pond Lane, Aquaville, AQ 12345",
                    },
                    { icon: Phone, text: "(555) 123-4567" },
                    { icon: Mail, text: "info@koivetservice.com" },
                    { icon: Clock, text: "Mon-Fri: 9am-5pm, Sat: 10am-2pm" },
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div key={index} className="flex items-center">
                      <Icon className="w-6 h-6 mr-4 text-blue-500" />
                      <p className="text-gray-700">{text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <MapPin className="mr-2" /> Find Our Koi Clinic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="h-[300px] w-full"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4867.094292753151!2d106.79814837591871!3d10.875131189279744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sVNUHCM%20Student%20Cultural%20House!5e1!3m2!1sen!2s!4v1729013178810!5m2!1sen!2s"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
