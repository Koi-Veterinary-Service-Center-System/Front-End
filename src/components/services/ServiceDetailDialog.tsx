import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Clock, DollarSign, Home, Globe, Info } from "lucide-react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

interface Service {
  serviceID: number;
  serviceName: string;
  description: string;
  price: number;
  estimatedDuration: number;
  quantityPrice: number;
  isAtHome: boolean;
  isOnline: boolean;
  imageURL?: string;
}

interface ServiceDetailDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailDialog: React.FC<ServiceDetailDialogProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg shadow-lg p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="relative">
                <img
                  src={
                    service.imageURL ||
                    "https://kehlanpools.com/wp-content/uploads/2022/03/blg1.jpg"
                  }
                  alt={`${service.serviceName} image`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <DialogTitle className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {service.serviceName}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </DialogHeader>
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-3"
                >
                  <Info
                    size={20}
                    className="text-blue-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-700">{service.description}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <DollarSign size={20} className="text-green-500" />
                  <p>
                    <span className="font-semibold">Price:</span>{" "}
                    {service.price.toLocaleString("vi-VN")} vnd
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <Clock size={20} className="text-orange-500" />
                  <p>
                    <span className="font-semibold">Estimated Duration:</span>{" "}
                    {service.estimatedDuration} hours
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <DollarSign size={20} className="text-purple-500" />
                  <p>
                    <span className="font-semibold">Quantity Price:</span>{" "}
                    {service.quantityPrice.toLocaleString("vi-VN")} vnd
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <Home
                    size={20}
                    className={
                      service.isAtHome ? "text-blue-500" : "text-gray-400"
                    }
                  />
                  <p>
                    <span className="font-semibold">
                      Available for At Home:
                    </span>{" "}
                    {service.isAtHome ? (
                      <AiOutlineCheckCircle className="text-blue-500" />
                    ) : (
                      <AiOutlineCloseCircle className="text-red-500" />
                    )}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center space-x-3"
                >
                  <Globe
                    size={20}
                    className={
                      service.isOnline ? "text-blue-500" : "text-gray-400"
                    }
                  />
                  <p>
                    <span className="font-semibold">Available Online:</span>{" "}
                    {service.isOnline ? (
                      <AiOutlineCheckCircle className="text-blue-500" />
                    ) : (
                      <AiOutlineCloseCircle className="text-red-500" />
                    )}
                  </p>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-end p-6 bg-gray-50"
              >
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailDialog;
