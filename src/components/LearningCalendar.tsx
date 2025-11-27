"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface LearningActivity {
  date: string;
  lessonsCompleted: number;
  timeSpent: number; // minutes
  streak: boolean;
}

export default function LearningCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data - replace with real data from API
  const activities: LearningActivity[] = [
    { date: "2025-11-10", lessonsCompleted: 2, timeSpent: 45, streak: true },
    { date: "2025-11-11", lessonsCompleted: 1, timeSpent: 30, streak: true },
    { date: "2025-11-12", lessonsCompleted: 3, timeSpent: 60, streak: true },
    { date: "2025-11-13", lessonsCompleted: 0, timeSpent: 0, streak: false },
    { date: "2025-11-14", lessonsCompleted: 2, timeSpent: 40, streak: true },
    { date: "2025-11-15", lessonsCompleted: 1, timeSpent: 25, streak: true },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivityForDate = (date: string) => {
    return activities.find((activity) => activity.date === date);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {monthYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }, (_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateStr = formatDate(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const activity = getActivityForDate(dateStr);
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={day}
                className={`
                  relative p-2 text-center rounded-lg border cursor-pointer transition-colors
                  ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                  ${activity?.streak ? "bg-green-50 border-green-200" : ""}
                  ${activity?.lessonsCompleted === 0 ? "bg-gray-50" : ""}
                  hover:bg-gray-100
                `}
              >
                <div className="text-sm font-medium">{day}</div>
                {activity && activity.lessonsCompleted > 0 && (
                  <div className="absolute top-1 right-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.lessonsCompleted >= 3
                          ? "bg-green-500"
                          : activity.lessonsCompleted >= 2
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>
                )}
                {activity && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.lessonsCompleted > 0 && (
                      <div>{activity.lessonsCompleted}L</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>3+ Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>2 Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>1 Lesson</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
