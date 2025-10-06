"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s new for you
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Recent Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Content</h2>
            <Button variant="outline" onClick={() => router.push("/content")}>
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
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
      </main>
    </div>
  );
}
