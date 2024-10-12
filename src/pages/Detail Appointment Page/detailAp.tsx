import { Calendar, Clock, MapPin, Phone, User, Fish } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AppointmentList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Veterinarian Appointments
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Customer:</span>
                  {appointment.customerName}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Phone:</span>
                  {appointment.phoneNumber}
                </div>
                <div className="flex items-center">
                  <Fish className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Koi/Pool Name:</span>
                  {appointment.petName}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Date:</span>
                  {appointment.bookingDate}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Time:</span>
                  {appointment.slotStartTime} - {appointment.slotEndTime}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Location:</span>
                  {appointment.location}
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold mr-2">Veterinarian:</span>
                  {appointment.vetName}
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Service:</span>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-221"
                  >
                    {appointment.serviceName}
                  </Badge>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button className="bg-cyan-500" size="sm">
                    Confirm
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
