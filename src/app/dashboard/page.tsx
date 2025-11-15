"use client";
import ProgressAnalytics from "@/components/ProgressAnalytics";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  ageGroup?: string;
  onboardingCompleted: boolean;
}

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user
        const userResponse = await fetch("/api/users");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Redirect to onboarding if not completed
          if (!userData.onboardingCompleted) {
            router.push("/onboarding");
            return;
          }

          // Fetch content based on user's age group
          const contentResponse = await fetch(
            `/api/content?ageGroup=${userData.ageGroup}&limit=6`
          );
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            setContent(contentData.content);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Personalized Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || "there"}! 🌱
              </h1>
              <p className="text-muted-foreground text-lg">
                Continue your climate learning journey
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/content")}>
                Browse Content
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/onboarding")}
              >
                Retake Assessment
              </Button>
            </div>
          </div>

          {/* Learning Streak Banner */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <h3 className="font-semibold text-lg">Learning Streak</h3>
                    <p className="text-muted-foreground">
                      Keep up the great momentum!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">7</div>
                  <div className="text-sm text-muted-foreground">days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Learning Path</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Current Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Climate Science Basics</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  65% Complete • 3 of 8 lessons
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Climate Champion</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Complete 10 lessons to unlock
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Suggested Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Renewable Energy</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on your progress
                </p>
                <Button size="sm" className="w-full">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Age Group</CardTitle>
              <CardDescription>Your content preference</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize">{user?.ageGroup}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Content</CardTitle>
              <CardDescription>Items for your age group</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{content.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
              <CardDescription>Content engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {content.reduce((acc, item) => acc + item.views, 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Level</CardTitle>
              <CardDescription>AI-assessed proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize text-green-600">
                {user?.ageGroup === "adults" ? "Intermediate" : "Beginner"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                📈 Progressing well
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Progress Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🤖 AI Learning Insights
          </h2>
          <ProgressAnalytics />
        </div>

        {/* Recommended Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              ⭐ Recommended for You
            </h2>
            <Button variant="outline" onClick={() => router.push("/content")}>
              View All Content
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="capitalize">{item.category}</span>
                    <span>{item.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {content.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No content available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push("/content?type=quiz")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-semibold">Take Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push("/content?category=solutions")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold">Climate Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about solutions
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push("/content?type=interactive")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold">Explore Interactive</h3>
                <p className="text-sm text-muted-foreground">
                  Hands-on learning
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push("/progress")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold">View Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Track your journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
