"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ageGroups = [
  {
    value: "child",
    label: "Child (5-12 years)",
    description: "Fun and educational content for young learners",
  },
  {
    value: "teen",
    label: "Teen (13-17 years)",
    description: "Engaging content for teenagers",
  },
  {
    value: "adult",
    label: "Adult (18+ years)",
    description: "Advanced content and resources",
  },
];

export default function OnboardingPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedGroup) return;

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ageGroup: selectedGroup,
          onboardingCompleted: true,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome! 👋</h1>
          <p className="text-muted-foreground">
            Please select your age group to get personalized content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {ageGroups.map((group) => (
            <Card
              key={group.value}
              className={`cursor-pointer transition-all ${
                selectedGroup === group.value
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedGroup(group.value)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{group.label}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedGroup || loading}
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
