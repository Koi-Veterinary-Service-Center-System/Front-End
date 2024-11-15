import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaQuoteLeft,
  FaQuoteRight,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
  FaMoneyBillWave,
  FaUserMd,
  FaGlobe,
  FaHome,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/configs/axios";
import { Feedback, Services } from "@/types/info";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function ServiceDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-full h-96 rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export default function DetailService() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Services | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceResponse = await api.get(`/service/${serviceId}`);
        setService(serviceResponse.data);

        const feedbackResponse = await api.get(
          `/Feedback/view-feedback-by/${serviceId}`
        );
        setFeedback(feedbackResponse.data);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ServiceDetailSkeleton />
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Feedback</h2>
          {[1, 2, 3].map((i) => (
            <FeedbackSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!service) {
    return <div className="text-center text-2xl mt-12">Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center"
          variant="outline"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Button>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <img
              src={service.imageURL}
              alt={service.serviceName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              {service.serviceName}
            </h1>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                  <FaMoneyBillWave className="text-blue-500" />
                  <CardTitle>Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {service.price.toLocaleString("vi-VN")} vnd
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                  <FaShoppingCart className="text-blue-500" />
                  <CardTitle>Quantity Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {service.quantityPrice.toLocaleString("vi-VN")} vnd
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                  <FaClock className="text-blue-500" />
                  <CardTitle>Estimated Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {service.estimatedDuration} hours
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <Card
                className={`w-1/2 ${
                  service.isAtHome ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-center space-x-2">
                  <FaHome
                    className={
                      service.isAtHome ? "text-green-500" : "text-gray-400"
                    }
                  />
                  <CardTitle>
                    {service.isAtHome
                      ? "Available at Home"
                      : "Not Available at Home"}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card
                className={`w-1/2 ${
                  service.isOnline ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-center space-x-2">
                  <FaGlobe
                    className={
                      service.isOnline ? "text-blue-500" : "text-gray-400"
                    }
                  />
                  <CardTitle>
                    {service.isOnline
                      ? "Available Online"
                      : "Not Available Online"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Feedback</h2>
          {feedback.filter((item) => item.isVisible).length > 0 ? (
            feedback
              .filter((item) => item.isVisible)
              .map((item) => (
                <Card
                  key={item.feedbackID}
                  className="mb-6 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={item.customerName} />
                          <AvatarFallback className="bg-blue-400">
                            {item.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold text-blue-800">
                            {item.customerName}
                          </CardTitle>
                          {item.vetName && (
                            <CardDescription className="text-sm font-medium text-blue-600">
                              <FaUserMd className="inline-block mr-1" />
                              Vet: {item.vetName}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < item.rate
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                              size={20}
                            />
                          ))}
                        </div>
                        <CardDescription className="text-sm font-medium text-blue-600 mt-1">
                          {item.serviceName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2">
                    <div className="relative">
                      <FaQuoteLeft
                        className="absolute top-0 left-0 text-blue-200 opacity-50"
                        size={20}
                      />
                      <p className="text-gray-700 pl-6 pr-6 pt-2 pb-2">
                        {isExpanded
                          ? item.comments
                          : `${item.comments.slice(0, 150)}${
                              item.comments.length > 150 ? "..." : ""
                            }`}
                      </p>
                      <FaQuoteRight
                        className="absolute bottom-0 right-0 text-blue-200 opacity-50"
                        size={20}
                      />
                    </div>
                    {item.comments.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <>
                            Show Less <FaChevronUp className="ml-2" />
                          </>
                        ) : (
                          <>
                            Read More <FaChevronDown className="ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
          ) : (
            <p className="text-gray-600">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/swp391veterinary.appspot.com/o/The%20Sad%20Snowman%20-%20Bird%20Watching.png?alt=media&token=86e7f422-d825-498d-b0c8-bc1b28646e9b"
                alt="No feedback available"
                className="w-48 h-36 object-contain mb-4"
              />
              No feedback available for this service yet.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
