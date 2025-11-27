"use client";

import { motion } from "framer-motion";
import { StatCard } from "../activities/components/stat-card";
import { ClimateChart } from "../activities/components/climate-chart";
import { Card2, Card2Header, Card2Title, Card2Description, Card2Content } from "@/components/ui/card2";
import { Progress } from "@/components/ui/progress";

import Link from "next/link";
import { LayoutDashboard, Route, MessagesSquare, Settings } from "lucide-react";
import { Leaf, BookOpen, Sparkles, BarChart3, Target } from "lucide-react";

const masteryData = [
  { topic: "Renewable Energy", score: 78 },
  { topic: "Pollution & Waste", score: 64 },
  { topic: "Climate Systems", score: 85 },
  { topic: "Carbon Footprint", score: 56 },
  { topic: "Ecosystems", score: 72 },
];

export default function InsightsPage() {
  return (
    <div className="flex flex-row w-full">
      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-transparent backdrop-blur-xl text-black dark:text-white flex flex-col rounded-xl text-sm mr-2 mt-18">
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
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <LayoutDashboard size={18} /> Dashboard
              </Link>

              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <Route size={18} /> Learning Path
              </button>

              <Link href="/dashboard/quizzes" className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <BookOpen size={18} /> Quizzes
              </Link>

              <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
                <Sparkles size={18} /> Activities
              </button>

              <Link href="/dashboard/insights-page" className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/10 text-black dark:text-white transition">
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-10 w-full mt-20"
      >
      <h1 className="text-5xl font-bold text-center tracking-tight">Insights</h1>
      <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto mb-10">
        Your learning analytics based on quizzes, modules, and climate activities.
      </p>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Climate Score"
          value="78"
          subtitle="Based on all modules"
          trend="+10%"
          icon={<Leaf size={18} />}
        />
        <StatCard
          title="Quiz Performance"
          value="83%"
          subtitle="Recent average accuracy"
          icon={<Target size={18} />}
        />
        <StatCard
          title="Activity Completion"
          value="12"
          subtitle="Tasks completed this month"
          icon={<Sparkles size={18} />}
        />
        <StatCard
          title="Learning Consistency"
          value="6 days"
          subtitle="Your current streak"
          icon={<BarChart3 size={18} />}
        />
      </div>

      {/* CHART + AI HIGHLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-3 flex justify-center items-center"
        >
          <div className="w-full max-w-4xl">
            <ClimateChart />
          </div>
        </motion.div>

        
      </div>

      {/* TOPIC MASTERY BREAKDOWN */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-base font-medium mb-3"
        >
          Topic Mastery Breakdown
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {masteryData.map((item, index) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <Card2 className="rounded-3xl p-6 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 border border-black/5 dark:border-white/10">
                <Card2Header className="space-y-1">
                  <Card2Title className="text-lg font-semibold tracking-tight">{item.topic}</Card2Title>
                  <Card2Description className="text-sm opacity-70">
                    {item.score >= 75
                      ? "Strong mastery"
                      : item.score >= 50
                      ? "Moderate understanding"
                      : "Needs improvement"}
                  </Card2Description>
                </Card2Header>

                <Card2Content className="mt-4 space-y-4">
                  <p className="text-sm text-black/80 dark:text-white/80 font-medium">
                    Mastery: {item.score}%
                  </p>
                  <Progress
                    value={item.score}
                    className="h-2.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 shadow-inner transition-all [&>div]:bg-green-500"
                  />
                </Card2Content>
              </Card2>
            </motion.div>
          ))}
        </div>
      </div>
      </motion.div>
    </div>
  );
}