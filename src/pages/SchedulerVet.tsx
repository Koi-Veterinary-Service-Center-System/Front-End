import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/configs/axios";
import { Link } from "react-router-dom";

// Cấu trúc dữ liệu 'vetSlots' dựa trên dữ liệu API trả về
interface VetSlot {
  slotID: number;
  slotStartTime: string;
  slotEndTime: string;
  weekDate: string;
  vetID: string;
  vetName: string;
  vetFirstName: string;
  vetLastName: string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
];

export default function VetCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 10)); // January 10, 2024
  const [events, setEvents] = useState<VetSlot[]>([]);

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const response = await api.get(`/vetslot/vet-schedule`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API Response:", response.data); // Ghi log để kiểm tra dữ liệu

        const dayOfWeekMap: Record<string, number> = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        const data = response.data
          .map((item: VetSlot) => {
            if (!item.slotStartTime || !item.slotEndTime) {
              console.warn(
                `Missing slot times for item with ID: ${item.slotID}`
              );
              return null; // Bỏ qua nếu thiếu dữ liệu thời gian
            }

            const eventDate = new Date(currentDate);
            eventDate.setDate(
              eventDate.getDate() -
                eventDate.getDay() +
                dayOfWeekMap[item.weekDate]
            );

            const [startHour, startMinute] = item.slotStartTime.split(":");
            const [endHour, endMinute] = item.slotEndTime.split(":");

            const startTime = new Date(eventDate);
            startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

            const endTime = new Date(eventDate);
            endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

            return {
              id: item.slotID,
              vetName: `${item.vetFirstName} ${item.vetLastName}`,
              startTime,
              endTime,
              slotStartTime: item.slotStartTime,
              slotEndTime: item.slotEndTime,
            };
          })
          .filter(Boolean); // Bỏ qua các giá trị null

        setEvents(data as VetSlot[]); // Kiểu xác định cho dữ liệu
        console.log(data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    fetchVet();
  }, [currentDate]);

  const getStartOfWeek = (date: Date): Date => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const getEventForSlot = (day: Date, time: string) => {
    const [timeHour] = time.split(" ");
    const hour = parseInt(timeHour);
    const event = events.find(
      (event) =>
        event.startTime.getDate() === day.getDate() &&
        event.startTime.getHours() ===
          (time.includes("PM") && hour !== 12 ? hour + 12 : hour)
    );
    return event;
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <div className="bg-white shadow rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold">
              {formatDate(currentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {getDaysOfWeek().map((day, index) => (
            <div
              key={index}
              className="p-2 text-center border-r last:border-r-0"
            >
              <div className="font-medium">{daysOfWeek[day.getDay()]}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={timeIndex}>
              <div className="p-2 border-r border-b text-sm text-gray-500">
                {time}
              </div>
              {getDaysOfWeek().map((day, dayIndex) => {
                const event = getEventForSlot(day, time);
                return (
                  <div
                    key={`${timeIndex}-${dayIndex}`}
                    className="border-r border-b last:border-r-0 relative p-6"
                  >
                    {event && (
                      <div className="absolute inset-0 bg-blue-100 border border-blue-300 rounded p-2">
                        <Link to="/detail">
                          <div className="font-semibold">{event.vetName}</div>
                        </Link>
                        <div className="text-xs">
                          {event.slotStartTime} - {event.slotEndTime}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Current Date: {currentDate.toLocaleDateString()}
      </div>
    </motion.div>
  );
}
