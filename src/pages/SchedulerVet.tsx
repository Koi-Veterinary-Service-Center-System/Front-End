import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import api from "@/configs/axios";
import { Link } from "react-router-dom";
import { VetSlots } from "@/types/info";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "7 AM",
  "8 AM",
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<VetSlots[]>([]);

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const response = await api.get(`/vetslot/vet-schedule`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

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
          .map((item: VetSlots) => {
            if (!item.slotStartTime || !item.slotEndTime) {
              console.warn(
                `Missing slot times for item with ID: ${item.slotID}`
              );
              return null;
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
              ...item,
              startTime, // Converted to Date object
              endTime, // Converted to Date object
            };
          })
          .filter(Boolean);

        setEvents(data as VetSlots[]);
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

  // Kiểm tra sự kiện có thuộc khung giờ này không
  const getEventForSlot = (day: Date, time: string) => {
    const [timeHour] = time.split(" ");
    const hour =
      parseInt(timeHour) +
      (time.includes("PM") && parseInt(timeHour) !== 12 ? 12 : 0);

    return events.find((event) => {
      if (!event.startTime || !event.endTime) {
        return false; // Return false if startTime or endTime is undefined
      }

      const eventDay = event.startTime.getDate() === day.getDate();
      const inSlotRange =
        event.startTime.getHours() <= hour && event.endTime.getHours() > hour;

      return eventDay && inSlotRange;
    });
  };

  const flashingVariants = {
    flash: { opacity: [1, 0.7, 1], scale: [1, 1.05, 1] },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-4 md:p-8"
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
        {/* Calendar Header */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevWeek}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold">
                {formatDate(currentDate)}
              </span>
            </div>
            <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200">
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 bg-blue-50">
              <div className="p-3 border-r border-blue-100"></div>
              {getDaysOfWeek().map((day, index) => (
                <div
                  key={index}
                  className="p-3 text-center border-r border-blue-100 last:border-r-0"
                >
                  <div className="font-medium text-blue-800">
                    {daysOfWeek[day.getDay()]}
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-8">
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={timeIndex}>
                  <div className="p-3 border-r border-b border-blue-100 text-sm text-blue-600 font-medium">
                    {time}
                  </div>
                  {getDaysOfWeek().map((day, dayIndex) => {
                    const event = getEventForSlot(day, time);
                    return (
                      <div
                        key={`${timeIndex}-${dayIndex}`}
                        className="border-r border-b border-blue-100 last:border-r-0 relative p-2"
                      >
                        {event && (
                          <motion.div
                            className={`${
                              event.isBook
                                ? "bg-blue-300 border border-blue-400"
                                : "bg-blue-200 border border-blue-300"
                            } rounded p-1 text-xs`}
                            variants={event.isBook ? flashingVariants : {}}
                            animate={event.isBook ? "flash" : ""}
                            transition={
                              event.isBook
                                ? {
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                  }
                                : {}
                            }
                          >
                            <Link to="/detail" className="block mb-1">
                              <div className="font-semibold text-blue-800">
                                {event.vetName}
                              </div>
                              <div className="text-blue-600">
                                {event.startTime?.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {event.endTime?.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </Link>
                            <Link
                              to={event.meetURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center bg-blue-100 text-black py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-200"
                            >
                              <img
                                src="https://static.vecteezy.com/system/resources/previews/022/101/036/original/google-meet-logo-transparent-free-png.png"
                                alt="Google Meet"
                                className="h-8 mr-2"
                              />
                              Join Meet
                              {event.meetURL && (
                                <motion.div
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <FaCircle className="text-red-600 ml-2" />
                                </motion.div>
                              )}
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
