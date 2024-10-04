import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Fish,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Mock data - in a real app, this would be an array of appointments
const scheduleSlot = {
  isBook: false,
  slotID: 1,
  slotStartTime: "09:00:00",
  slotEndTime: "10:00:00",
  weekDate: "Monday",
  vetId: "v1",
  vetName: "johndoe",
  vetFirstName: "John",
  vetLastName: "Doe",
};

// For demonstration, creating multiple slots
const mockSchedule = [
  {
    ...scheduleSlot,
    isBook: true,
    customerName: "Alice Smith",
    serviceType: "Koi Health Check",
  },
  {
    ...scheduleSlot,
    slotStartTime: "10:00:00",
    slotEndTime: "11:00:00",
    isBook: false,
  },
  {
    ...scheduleSlot,
    slotStartTime: "11:00:00",
    slotEndTime: "12:00:00",
    isBook: true,
    customerName: "Bob Johnson",
    serviceType: "Pond Water Quality Assessment",
  },
];

export default function SchedulesV() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Schedule</h1>
          <p className="text-gray-500">
            Dr. {scheduleSlot.vetFirstName} {scheduleSlot.vetLastName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" />
          <span className="font-medium">{scheduleSlot.weekDate}</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockSchedule.map((slot, index) => (
          <Card
            key={index}
            className={slot.isBook ? "border-l-4 border-l-blue-600" : ""}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-20">
                  <Clock className="text-gray-500 mb-1" size={20} />
                  <span className="text-sm font-medium">
                    {slot.slotStartTime.slice(0, 5)}
                  </span>
                </div>

                {slot.isBook ? (
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <User size={20} className="text-gray-500" />
                      {slot.customerName}
                    </h3>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <Fish size={16} />
                      {slot.serviceType}
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500">Available Slot</div>
                )}
              </div>

              <div className="flex items-center">
                {slot.isBook ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : (
                  <XCircle className="text-gray-400" size={24} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Availability
        </button>
        <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
          Block Time Off
        </button>
      </div>
    </div>
  );
}
