"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button2 } from "@/components/ui/button2";
import Link from "next/link";
interface Suggestion {
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
}

const suggestions: Suggestion[] = [
  {
    title: "Start with Climate Basics",
    description:
      "Understand greenhouse gases, global warming & climate systems.",
    progress: 70,
    icon: <Leaf className="text-green-600 dark:text-green-400" size={20} />,
  },
  {
    title: "Try Renewable Energy",
    description: "Explore solar, wind, hydro & new sustainable tech.",
    progress: 45,
    icon: (
      <Sparkles className="text-yellow-600 dark:text-yellow-400" size={20} />
    ),
  },
];

export function LearningPathCard({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer Glass Container */}
      <div className="rounded-2xl p-6 bg-[#f4f4f4] dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] space-y-5 border-none">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-black dark:text-white tracking-wide">
            AI Suggestions
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Recommended modules based on your learning pattern.
          </p>
        </div>

        {/* Suggestions List */}
        <div className="flex flex-row gap-5 overflow-x-auto pb-2">
          {suggestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl p-5 bg-[#f4f4f4] dark:bg-transparent backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-200 flex flex-row items-start gap-5 min-w-[340px]"
            >
              {/* Left Section: Icon + Text + Progress */}
              <div className="flex flex-col w-3/5 gap-3">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h3 className="text-lg font-medium text-black dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-tight">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: Button */}
              <div className="flex w-2/5 items-center justify-end">
                <Link href="/dashboard/quizzes">
                  <Button2
                    className="px-5 py-2.5 flex items-center gap-2
                             text-black dark:text-white 
                             bg-black/5 dark:bg-white/5 
                             hover:bg-black/10 dark:hover:bg-white/10
                             rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  >
                    Continue
                    <ArrowRight
                      size={16}
                      className="text-black dark:text-white"
                    />
                  </Button2>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
