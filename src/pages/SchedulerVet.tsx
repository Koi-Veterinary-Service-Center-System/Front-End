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
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-4">Calendar</h1>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevWeek}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextWeek}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
              <span className="text-2xl font-semibold">
                {formatDate(currentDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <CalendarIcon className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <MoreVertical className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 bg-blue-50">
          <div className="p-4 border-r border-blue-100"></div>
          {getDaysOfWeek().map((day, index) => (
            <div
              key={index}
              className="p-4 text-center border-r border-blue-100 last:border-r-0"
            >
              <div className="font-medium text-blue-800">
                {daysOfWeek[day.getDay()]}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={timeIndex}>
              <div className="p-4 border-r border-b border-blue-100 text-sm text-blue-600 font-medium">
                {time}
              </div>
              {getDaysOfWeek().map((day, dayIndex) => {
                const event = getEventForSlot(day, time);
                return (
                  <motion.div
                    key={`${timeIndex}-${dayIndex}`}
                    className="border-r border-b border-blue-100 last:border-r-0 relative p-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    {event && (
                      <motion.div
                        className="absolute inset-1 bg-blue-200 border border-blue-300 rounded-lg p-2 shadow-md"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (timeIndex + dayIndex) }}
                      >
                        <Link to="/detail" className="block">
                          <div className="font-semibold text-blue-800">
                            {event.vetName}
                          </div>
                          <div className="text-xs text-blue-600">
                            {event.slotStartTime} - {event.slotEndTime}
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="mt-6 text-sm text-blue-600 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Current Date: {currentDate.toLocaleDateString()}
      </motion.div>
    </motion.div>
  );
}
