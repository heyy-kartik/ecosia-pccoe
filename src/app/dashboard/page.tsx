"use client";

import { useState } from "react";
import { StatCard } from "./activities/components/stat-card";
import { ClimateChart } from "./activities/components/climate-chart";
import { LearningPathCard } from "@/components/learning-path-card";
import { TopicsTable } from "./activities/components/topics-table";
import { PersonalizedCopilot } from "@/components/copilot/PersonalizedCopilot";
import { Leaf, Target, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const scrollReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const parallax: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Overview Tab */}
      {tab === "Overview" && (
        <div className="flex flex-col gap-6">
          {/* Stat Cards */}
          <motion.div
            variants={parallax}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard
              title="Climate Score"
              value="78"
              subtitle="Your overall understanding"
              trend="+12% this week"
              icon={<Leaf size={18} />}
            />
            <StatCard
              title="Quiz Accuracy"
              value="85%"
              subtitle="Across last 5 quizzes"
              icon={<Target size={18} />}
            />
            <StatCard
              title="Lessons Completed"
              value="14"
              subtitle="Across all climate topics"
              icon={<BookOpen size={18} />}
            />
            <StatCard
              title="Activity Points"
              value="260"
              subtitle="Earned from climate tasks"
              icon={<Sparkles size={18} />}
            />
          </motion.div>

          {/* Climate Chart — full width & spacious */}
          <motion.div
            variants={parallax}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full"
          >
            <ClimateChart />
          </motion.div>

          {/* Personalized Copilot — full width below chart */}
          <motion.div
            variants={parallax}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full"
          >
            <PersonalizedCopilot />
          </motion.div>

          {/* Learning Path — horizontal full width */}
          <motion.div
            variants={parallax}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full"
          >
            <LearningPathCard />
          </motion.div>

          {/* Topics Table */}
          <motion.div
            variants={parallax}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full"
          >
            <TopicsTable />
          </motion.div>
        </div>
      )}

      {tab === "Quizzes" && (
        <div className="text-muted-foreground text-lg opacity-70">
          Quizzes page coming soon…
        </div>
      )}

      {tab === "Activities" && (
        <div className="text-muted-foreground text-lg opacity-70">
          Activities page coming soon…
        </div>
      )}

      {tab === "Learning Path" && (
        <div className="text-muted-foreground text-lg opacity-70">
          Full learning path page coming soon…
        </div>
      )}

      {tab === "Insights" && (
        <div className="text-muted-foreground text-lg opacity-70">
          Insights page coming soon…
        </div>
      )}
    </motion.div>
  );
}
