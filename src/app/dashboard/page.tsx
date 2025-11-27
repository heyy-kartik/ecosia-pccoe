"use client";

import { useState } from "react";
import { TabSwitcher } from "./activities/components/tabs-switcher";

import { StatCard } from "./activities/components/stat-card";
import { ClimateChart } from "./activities/components/climate-chart";
import { LearningPathCard } from "@/components/learning-path-card";
import { TopicsTable } from "./activities/components/topics-table";

import { Leaf, Target, BookOpen, Sparkles } from "lucide-react";
import { LayoutDashboard, Route, BarChart3, MessagesSquare, Settings } from "lucide-react";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useScroll } from "framer-motion";
import Link from "next/link";

const scrollReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const parallax: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");

  const { scrollY } = useScroll();

  const totalViews = content.reduce((sum, c) => sum + c.views, 0);
  const uniqueCategories = new Set(content.map((c) => c.category)).size;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-row w-full min-h-screen bg-[#f5f3f0] dark:bg-black rounded-xl p-6 text-sm mt-12"
    >
      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-transparent backdrop-blur-xl text-black dark:text-white flex flex-col rounded-xl text-sm">
        {/* Top section */}
        <div className="px-5 py-4 flex items-center gap-2">
          <Leaf className="text-green-400" size={22} />
          <span className="text-lg font-semibold tracking-tight text-black dark:text-white">Ecosia</span>
        </div>

        {/* Navigation sections */}
        <div className="flex-1 flex flex-col justify-between py-4">

          <div>
            {/* HOME SECTION */}
            <div className="px-6 pb-2 text-xs uppercase tracking-wider text-gray-500">Home</div>
            <nav className="flex flex-col gap-0.5 px-3 mb-4">
              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/10 text-black dark:text-white">
                <LayoutDashboard size={18} /> Dashboard
              </button>

              <Link
                href="/dashboard/activities/learningPath"
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <Route size={18} /> Learning Path
              </Link>

              <Link
                href="/dashboard/quizzes"
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <BookOpen size={18} /> Quizzes
              </Link>

              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <Sparkles size={18} /> Activities
              </button>

              <Link href="/dashboard/insights-page" className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <BarChart3 size={18} /> Insights
              </Link>

              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <MessagesSquare size={18} /> AI Assistant
              </button>
            </nav>
          </div>

          <div className="mt-auto">
            {/* DOCUMENTS SECTION */}
            <div className="px-6 pb-2 mt-2 text-xs uppercase tracking-wider text-gray-500">Documents</div>
            <nav className="flex flex-col gap-0.5 px-3">
              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <Settings size={18} /> Settings
              </button>
            </nav>
          </div>

        </div>
      </aside>
      
      <div className="flex-1 p-6 flex flex-col gap-10 overflow-y-auto text-black dark:text-white">

        {/* Overview Tab */}
        {tab === "Overview" && (
          <div className="flex flex-col gap-10">

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
          <div className="text-black/60 dark:text-muted-foreground text-lg opacity-70">
            Quizzes page coming soon…
          </div>
        )}

        {tab === "Activities" && (
          <div className="text-black/60 dark:text-muted-foreground text-lg opacity-70">
            Activities page coming soon…
          </div>
        )}

        {tab === "Learning Path" && (
          <div className="text-black/60 dark:text-muted-foreground text-lg opacity-70">
            Full learning path page coming soon…
          </div>
        )}

        {tab === "Insights" && (
          <div className="text-black/60 dark:text-muted-foreground text-lg opacity-70">
            Insights page coming soon…
          </div>
        )}
      </div>
    </motion.div>
  );
}