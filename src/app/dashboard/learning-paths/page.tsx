"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PersonalizedCopilot } from "@/components/copilot/PersonalizedCopilot";
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

const learningPaths = [
  {
    title: "Climate Change Fundamentals",
    description:
      "Master the basics of climate science, greenhouse gases, and global warming.",
    modules: 8,
    duration: "4 weeks",
    difficulty: "Beginner",
    progress: 75,
    completed: 6,
    total: 8,
  },
  {
    title: "Renewable Energy Systems",
    description:
      "Explore solar, wind, hydro, and emerging clean energy technologies.",
    modules: 12,
    duration: "6 weeks",
    difficulty: "Intermediate",
    progress: 33,
    completed: 4,
    total: 12,
  },
  {
    title: "Sustainable Living Practices",
    description:
      "Learn practical ways to reduce your carbon footprint in daily life.",
    modules: 10,
    duration: "5 weeks",
    difficulty: "Beginner",
    progress: 0,
    completed: 0,
    total: 10,
  },
  {
    title: "Climate Policy & Economics",
    description:
      "Understand global climate agreements, carbon markets, and policy frameworks.",
    modules: 15,
    duration: "8 weeks",
    difficulty: "Advanced",
    progress: 0,
    completed: 0,
    total: 15,
  },
  {
    title: "Ecosystem Conservation",
    description:
      "Study biodiversity, habitat protection, and ecosystem restoration strategies.",
    modules: 11,
    duration: "6 weeks",
    difficulty: "Intermediate",
    progress: 18,
    completed: 2,
    total: 11,
  },
  {
    title: "Climate Action Leadership",
    description:
      "Develop skills to lead climate initiatives in your community and workplace.",
    modules: 9,
    duration: "5 weeks",
    difficulty: "Advanced",
    progress: 0,
    completed: 0,
    total: 9,
  },
];

export default function LearningPathsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6 w-full"
    >
      <div>
        <h1 className="text-2xl font-bold mb-2">Learning Paths</h1>
        <p className="text-sm text-muted-foreground">
          Structured courses designed to take you from beginner to expert in
          climate education.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
            >
              <Card className="rounded-lg shadow-md hover:shadow-lg transition-all h-full flex flex-col p-3 text-xs md:text-sm">
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-base font-semibold md:text-lg">
                      {path.title}
                    </CardTitle>
                    <Badge
                      variant={
                        path.difficulty === "Beginner"
                          ? "default"
                          : path.difficulty === "Intermediate"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {path.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs md:text-sm">{path.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{path.modules} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{path.duration}</span>
                    </div>
                  </div>

                  {path.progress > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progress
                        </span>
                        <span className="font-medium">
                          {path.completed}/{path.total} completed
                        </span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-1">
                  <Button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm">
                    {path.progress > 0 ? (
                      <>
                        Continue Learning
                        <ChevronRight size={16} />
                      </>
                    ) : (
                      <>
                        Start Path
                        <ChevronRight size={16} />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <PersonalizedCopilot className="w-full" />
      </div>
    </motion.div>
  );
}
