"use strict";

import dashboardItems from "@/app/dashboard/data.json";
import { parseLearnerProgress } from "@/lib/utils";
import type { LearnerSnapshot } from "@/types/copilot";

/**
 * buildLearnerSnapshot
 * Derives learner insights from the mock dashboard dataset.
 * This mimics what a real analytics layer would collect from lessons,
 * quizzes, and activities, but keeps everything deterministic for now.
 */
export function buildLearnerSnapshot(): LearnerSnapshot {
  const completed = dashboardItems.filter((item) => item.status === "Done");
  const inProcess = dashboardItems.filter((item) => item.status === "In Process");
  const backlog = dashboardItems.filter((item) => item.status !== "Done" && item.status !== "In Process");

  // Use the enhanced progress parsing function for deeper insights
  const progressData = parseLearnerProgress(dashboardItems);

  const focusAreas = [...inProcess, ...backlog]
    .slice(0, 6)
    .map(({ id, header, status, type, reviewer }) => ({
      id,
      title: header,
      status,
      type,
      reviewer,
    }));

  // Enhanced strengths based on progress analysis
  const strengths = progressData.strongTopics.length > 0 
    ? progressData.strongTopics
    : completed.slice(0, 3).map((item) => item.header);

  // Use weak topics from progress analysis as improvement areas
  const improvementAreas = progressData.weakTopics.length > 0
    ? progressData.weakTopics
    : focusAreas.slice(0, 3).map((item) => item.title);

  return {
    totals: {
      completed: completed.length,
      inProgress: inProcess.length,
      upcoming: backlog.length,
    },
    focusAreas,
    strengths,
    improvementAreas,
    streakDays: progressData.currentStreak,
    lastActive: new Date().toISOString(),
  };
}

