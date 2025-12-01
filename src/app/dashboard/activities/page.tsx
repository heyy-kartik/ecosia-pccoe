"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Recycle,
  Droplets,
  Lightbulb,
  Footprints,
  TreePine,
  Binoculars,
  ChevronRight,
} from "lucide-react";

const activities = [
  {
    title: "Water Usage Tracker",
    description: "Track your daily water consumption and learn to reduce waste.",
    icon: <Droplets size={22} />,
    difficulty: "Easy",
    href: "/dashboard/activities/water-usage-tracker",
  },
  {
    title: "One-Day Zero Waste Challenge",
    description: "Try living one day without creating any non-recyclable waste.",
    icon: <Recycle size={22} />,
    difficulty: "Medium",
    href: "/dashboard/activities/zero-waste-challenge",
  },
  {
    title: "Energy Saving Mission",
    description: "Reduce electricity use by 20% for 24 hours.",
    icon: <Lightbulb size={22} />,
    difficulty: "Hard",
    href: "/dashboard/activities/energy-saving-mission",
  },
  {
    title: "Plant a Tree Activity",
    description: "Plant a sapling and document its growth over 30 days.",
    icon: <TreePine size={22} />,
    difficulty: "Easy",
    href: "/dashboard/activities/plant-a-tree",
  },
  {
    title: "Carbon Footprint Challenge",
    description: "Calculate your weekly carbon footprint and lower it by 10%.",
    icon: <Footprints size={22} />,
    difficulty: "Medium",
    href: "/dashboard/activities/carbon-footprint-challenge",
  },
  {
    title: "Local Ecosystem Study",
    description: "Observe and document biodiversity in nearby areas.",
    icon: <Binoculars size={22} />,
    difficulty: "Hard",
    href: "/dashboard/activities/local-ecosystem-study",
  },
];

export default function ActivitiesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold mb-2">Activities</h1>
        <p className="text-sm text-muted-foreground">
          Climate-friendly challenges designed to help you apply what you learn in the real world.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-green-600">{activity.icon}</div>
                  <CardTitle className="text-base">{activity.title}</CardTitle>
                </div>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <span
                  className={
                    activity.difficulty === "Easy"
                      ? "text-green-600 text-sm font-medium"
                      : activity.difficulty === "Medium"
                      ? "text-yellow-600 text-sm font-medium"
                      : "text-red-600 text-sm font-medium"
                  }
                >
                  {activity.difficulty}
                </span>

                <Button className="flex items-center gap-1" asChild disabled={!activity.href}>
                  <Link href={activity.href ?? "#"}>
                    Start Activity
                    <ChevronRight size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}