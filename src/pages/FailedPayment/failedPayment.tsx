import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XCircle,
  Calendar,
  Clock,
  RefreshCw,
  LifeBuoy,
  Fish,
} from "lucide-react";

export default function PaymentFailed() {
  // In a real application, you would fetch these details from your backend or state management
  const bookingDetails = {
    service: "Annual Check-up",
    date: "April 15, 2024",
    time: "2:30 PM",
    petName: "Goldie",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-6">
            We're sorry, but there was an issue processing your payment for Koi
            Veterinary Services
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-5 w-5" />
                Date:
              </span>
              <span className="font-semibold">{bookingDetails.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Clock className="mr-2 h-5 w-5" />
                Time:
              </span>
              <span className="font-semibold">{bookingDetails.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Fish className="mr-2 h-5 w-5" />
                Pet:
              </span>
              <span className="font-semibold">{bookingDetails.petName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">Service:</span>
              <span className="font-semibold">{bookingDetails.service}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Your booking is not confirmed. Please try again or contact our
            support team for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center"
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
