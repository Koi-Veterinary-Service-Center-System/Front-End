"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaScroll,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaComments,
  FaUserShield,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const termsContent = [
    {
      title: "1. Appointment Booking Policy",
      icon: <FaCalendarAlt className="text-blue-500" />,
      content: `• Customers can book appointments through our online system or by directly contacting the center.
• For services that require a veterinarian to visit the location, the service fee includes veterinary service fees and travel expenses, calculated based on the distance to the customer's specified location.
• Customers may choose a specific veterinarian, or the center will assign one if no preference is specified.
• Appointments must be booked at least 12 hours in advance.
• Each customer is allowed to book only one appointment at a time. If additional appointments are needed, please contact our hotline for assistance.
• Apart from online consultation, other services can be paid for by cash or VNPay.
• After successfully booking an appointment, customers are requested to keep their phones available for 10 minutes so the center can confirm the appointment. If confirmation is not possible:
  o For cash payment: the appointment will be canceled without a refund.
  o For VNPay payment: the appointment will be canceled, and only 70% of the transferred amount will be refunded.
• Note: Please double-check your information before confirming the appointment, as the appointment details cannot be modified afterward.`,
    },
    {
      title: "2. Service Completion Confirmation Policy",
      icon: <FaCheckCircle className="text-green-500" />,
      content: `• After the service is completed, customers may confirm or provide feedback on the service quality through the system.
• If no feedback or complaint is received within 7 days after the service is completed, the system will automatically mark the service as completed.`,
    },
    {
      title: "3. Appointment Cancellation Policy",
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      content: `3.1 Cancellations by the Customer
  • Customers may cancel their appointment before it transitions to the "In Progress" status.
  o For cash payment: no refund will be provided.
  o For VNPay payment:
    Canceled 7 days prior: 100% refund.
    Canceled 3 days prior: 50% refund.
    Canceled after 3 days: no refund.
  3.2 Cancellations by the Center
  • If the center initiates a cancellation due to internal issues, we will provide a 100% refund or assist in rescheduling.
  • If the appointment is canceled due to an issue on the customer's side (such as not answering the confirmation call for cash payment), no refund will be provided.`,
    },
    {
      title: "4. Payment Policy",
      icon: <FaMoneyBillWave className="text-green-600" />,
      content: `• The center currently accepts two payment methods:
  o Cash
  o VNPay (Additional methods will be available in the future.)
  • The service fee includes the veterinarian's travel expenses (if applicable) and the main service fee, excluding other potential costs that may arise during treatment.
  • Online consultation services require prior payment through VNPay.`,
    },
    {
      title: "5. Privacy Policy",
      icon: <FaLock className="text-purple-500" />,
      content: `• Customer information, appointment records, Koi fish medical records, and refunds are securely stored and used solely to provide services and enhance user experience.
  • We are committed to not sharing customer information with third parties unless there is customer consent or a legal requirement.`,
    },
    {
      title: "6. Feedback and Review Policy",
      icon: <FaComments className="text-blue-600" />,
      content: `• Customers may leave feedback and reviews after service completion.
  • We value customer input to improve our service quality and will promptly address any service-related complaints.
  • When leaving feedback, please avoid aggressive or inappropriate language, as unsuitable comments may be removed.`,
    },
    {
      title: "7. Complaint Resolution Policy",
      icon: <FaClipboardList className="text-red-500" />,
      content: `• For any complaints related to our services, please contact the center for support.
  • The center will process complaints within 4 working days from the receipt of the customer's information.`,
    },
    {
      title: "8. User Account Policy",
      icon: <FaUserShield className="text-indigo-500" />,
      content: `• Customers must register a valid account and provide accurate information when using our services.
  • Accounts will be suspended or permanently banned if any of the following violations occur:
  o Providing false or inaccurate information.
  o Using the account for fraudulent activities, system disruption, or actions negatively affecting the center and other customers.
  o Leaving dishonest reviews or comments that harm the reputation of the center or others.
  o Sharing a personal account with others without the center's consent.
  • In case of account suspension, the center reserves the right to withhold any service fees previously paid.`,
    },
    {
      title: "9. Terms of Use",
      icon: <FaScroll className="text-gray-600" />,
      content: `• By accessing and using our website, customers agree to comply with the center's policies.
  • The center reserves the right to modify or update these policies without prior notice to align with legal regulations and operational needs.`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={toggleModal}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300"
        >
          View Terms and Conditions
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-blue-50 to-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center">
                <FaScroll className="mr-2" />
                Terms and Conditions
              </DialogTitle>
              <DialogDescription>
                Please read our terms and conditions carefully before using our
                services.
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-[60vh] w-full pr-4">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-blue-700">
                    Service Usage Policy at KoiNe - Koi Veterinary Service
                    Center
                  </p>
                  <p className="text-gray-700">
                    Welcome to KoiNe. We are committed to providing high-quality
                    care and treatment services for Koi fish, ensuring optimal
                    health and living conditions for your fish. When using our
                    services, please carefully read and comply with the
                    following policies.
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    {termsContent.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg font-semibold text-blue-700 hover:text-blue-800">
                          <span className="flex items-center">
                            {section.icon}
                            <span className="ml-2">{section.title}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-700 whitespace-pre-line">
                            {section.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <p className="text-gray-700 mt-4">
                    Thank you for trusting and using KoiNe's services. For any
                    inquiries, please contact us for detailed support.
                  </p>
                </div>
              </ScrollArea>
            </motion.div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={toggleModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                I Understand
              </Button>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default TermsModal;
