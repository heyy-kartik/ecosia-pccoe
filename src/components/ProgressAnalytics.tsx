"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Clock,
  Brain,
  BookOpen,
  Award,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";

interface LearningAnalytics {
  totalTimeSpent: number;
  completedLessons: number;
  currentStreak: number;
  knowledgeLevel: string;
  strongAreas: string[];
  improvementAreas: string[];
  weeklyProgress: Array<{
    week: string;
    completed: number;
    timeSpent: number;
  }>;
  upcomingMilestones: Array<{
    title: string;
    progress: number;
    target: number;
  }>;
}

interface ContentRecommendation {
  contentId: string;
  title: string;
  type: string;
  difficulty: string;
  estimatedDuration: number;
  relevanceScore: number;
  adaptationReason: string;
}

export default function ProgressAnalytics() {
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<
    ContentRecommendation[]
  >([]);
  const [selectedType, setSelectedType] = useState<
    "next_lesson" | "review" | "challenge"
  >("next_lesson");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedType]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `/api/ai-recommendations?type=${selectedType}&limit=6`
      );
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (contentId: string, progress: number) => {
    try {
      await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_progress",
          contentId,
          context: {
            completionRate: progress / 100,
            timeSpent: Math.random() * 1800 + 600, // Simulated time
            difficulty: 3, // Default difficulty rating
          },
        }),
      });

      // Refresh analytics and recommendations
      fetchAnalytics();
      fetchRecommendations();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Learning Streak
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.currentStreak} days
            </div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.totalTimeSpent / 60)} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {Math.round(
                (analytics.weeklyProgress[analytics.weeklyProgress.length - 1]
                  ?.timeSpent || 0) / 60
              )}{" "}
              hrs this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Lessons
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.completedLessons}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {analytics.weeklyProgress[analytics.weeklyProgress.length - 1]
                ?.completed || 0}{" "}
              this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Knowledge Level
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {analytics.knowledgeLevel}
            </div>
            <p className="text-xs text-muted-foreground">AI-assessed level</p>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Strong Areas
            </CardTitle>
            <CardDescription>Topics you&apos;ve mastered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.strongAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{area}</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Mastered
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Growth Areas
            </CardTitle>
            <CardDescription>Areas for improvement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.improvementAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{area}</span>
                <Badge variant="outline" className="text-orange-600">
                  Focus Area
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Upcoming Milestones
          </CardTitle>
          <CardDescription>Goals you&apos;re working towards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.upcomingMilestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{milestone.title}</span>
                <span className="text-sm text-muted-foreground">
                  {milestone.progress}/{milestone.target}
                </span>
              </div>
              <Progress
                value={(milestone.progress / milestone.target) * 100}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>Personalized content just for you</CardDescription>

          <div className="flex gap-2 mt-4">
            {[
              { key: "next_lesson", label: "Next Lessons", icon: BookOpen },
              { key: "review", label: "Review", icon: Target },
              { key: "challenge", label: "Challenges", icon: Zap },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.contentId}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <Badge
                      variant={
                        rec.difficulty === "advanced"
                          ? "destructive"
                          : rec.difficulty === "intermediate"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {rec.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.estimatedDuration} min
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {rec.adaptationReason}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Type: {rec.type}</span>
                    <span>Relevance: {rec.relevanceScore}/10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateProgress(rec.contentId, 100)}
                    className="shrink-0"
                  >
                    Start Learning
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {recommendations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No recommendations available. Complete your onboarding to get
                started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
