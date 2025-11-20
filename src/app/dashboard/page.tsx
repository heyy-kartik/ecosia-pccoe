"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";

import ProgressAnalytics from "@/components/ProgressAnalytics";
import Footer from "@/components/Footer";

import {
  IconTrendingUp,
  IconBook,
  IconEye,
  IconCategory,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const userRes = await fetch("/api/users");
        if (!userRes.ok) return;

        const userData = await userRes.json();
        setUser(userData);

        if (!userData.onboardingCompleted) {
          router.push("/onboarding");
          return;
        }

        const contentRes = await fetch(
          `/api/content?ageGroup=${userData.ageGroup}&limit=6`
        );

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContent(contentData.content);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">
          <ProgressAnalytics /> Loading your dashboard...
        </div>
      </div>
    );
  }

  const totalViews = content.reduce((sum, c) => sum + c.views, 0);
  const uniqueCategories = new Set(content.map((c) => c.category)).size;

  return (
    <DashboardLayout>
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Welcome */}
        <div className="mt-6 mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.firstName || "there"} 🌱
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

        {/* Streak */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-10">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔥</div>
              <div>
                <h3 className="font-semibold text-lg">Learning Streak</h3>
                <p className="text-muted-foreground">
                  Keep up the great momentum
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">7</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Path */}
        <h2 className="text-2xl font-bold mb-4">Your Learning Path</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Current Goal */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>🎯 Current Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Climate Science Basics</h3>
              <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                65% complete • 3 of 8 lessons
              </p>
            </CardContent>
          </Card>

          {/* Milestone */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle>🏆 Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Climate Champion</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Complete 10 lessons to unlock
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Suggested Next */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle> Suggested Next</CardTitle>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Age Group */}
          <Card>
            <CardHeader>
              <CardDescription>Age Group</CardDescription>
              <CardTitle className="capitalize">
                {user?.ageGroup || "N/A"}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconBook className="size-4" />
                  Active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div>
                <p className="font-medium">Your content preference</p>
                <p className="text-muted-foreground">Curated for your group</p>
              </div>
            </CardFooter>
          </Card>

          {/* Content Count */}
          <Card>
            <CardHeader>
              <CardDescription>Available Content</CardDescription>
              <CardTitle>{content.length}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp className="size-4" />
                  Updated
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div>
                <p className="font-medium">Items for you</p>
                <p className="text-muted-foreground">Start learning today</p>
              </div>
            </CardFooter>
          </Card>

          {/* Views */}
          <Card>
            <CardHeader>
              <CardDescription>Total Views</CardDescription>
              <CardTitle>{totalViews}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconEye className="size-4" />
                  Engagement
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div>
                <p className="font-medium">Content engagement</p>
                <p className="text-muted-foreground">Popular topics</p>
              </div>
            </CardFooter>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardDescription>Categories</CardDescription>
              <CardTitle>{uniqueCategories}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconCategory className="size-4" />
                  Diverse
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <div>
                <p className="font-medium">Available categories</p>
                <p className="text-muted-foreground">Explore more</p>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Analytics */}
        <h2 className="text-2xl font-bold mb-4">🤖 AI Learning Insights</h2>
        <ProgressAnalytics />

        {/* Recommended Content */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">⭐ Recommended for You</h2>
            <Button variant="outline" onClick={() => router.push("/content")}>
              View All
            </Button>
          </div>

          {content.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No content available yet. Check back soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <IconEye className="size-4" /> {item.views}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => router.push("/content?type=quiz")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-semibold">Take Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Test what you learned
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => router.push("/content?category=solutions")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold">Climate Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about fixes
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => router.push("/content?type=interactive")}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold">Interactive</h3>
                <p className="text-sm text-muted-foreground">
                  Hands-on learning
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition"
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
    </DashboardLayout>
  );
}
