"use client";

import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock schedule data
const mockSchedule = {
  0: [{ start: "09:00", end: "17:00" }],
  1: [{ start: "10:00", end: "18:00" }],
  2: [{ start: "09:00", end: "17:00" }],
  3: [{ start: "08:00", end: "16:00" }],
  4: [{ start: "09:00", end: "17:00" }],
  5: [], // Weekend off
  6: [], // Weekend off
};

export default function Component() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const nextWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const prevWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const getDaysOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      return day;
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysOfWeek = getDaysOfWeek(currentWeek);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* ArrowLeft button to go back using window.history.back() */}
        <Button
          variant="ghost"
          className="w-10 h-10 p-0"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Button>
        <CardTitle>Fish Vet Schedule</CardTitle>
        <div className="w-10 h-10" /> {/* Placeholder for symmetry */}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {daysOfWeek[0].toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous week</span>
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next week</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-sm py-2 text-center">
              {day}
            </div>
          ))}
          {daysOfWeek.map((date, index) => (
            <div
              key={date.toISOString()}
              className="border rounded-md p-2 h-32 overflow-y-auto"
            >
              <div className="text-sm font-medium mb-1">{date.getDate()}</div>
              {mockSchedule[index].map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="text-xs bg-cyan-300 text-primary-foreground rounded px-1 py-0.5 mb-1"
                >
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </div>
              ))}
              {mockSchedule[index].length === 0 && (
                <div className="text-xs text-muted-foreground">Off duty</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
