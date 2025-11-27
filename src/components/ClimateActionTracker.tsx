"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Zap,
  Car,
  Recycle,
  Plus,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface ClimateAction {
  id: string;
  title: string;
  description: string;
  category: "energy" | "transport" | "waste" | "lifestyle";
  impact: number; // CO2 saved in kg
  completed: boolean;
  completedDate?: string;
}

interface ActionChallenge {
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
}

export default function ClimateActionTracker() {
  const [actions, setActions] = useState<ClimateAction[]>([
    {
      id: "1",
      title: "Use LED Bulbs",
      description: "Replace incandescent bulbs with LED",
      category: "energy",
      impact: 45,
      completed: true,
      completedDate: "2025-11-10",
    },
    {
      id: "2",
      title: "Bike to Work",
      description: "Use bicycle instead of car for commuting",
      category: "transport",
      impact: 120,
      completed: true,
      completedDate: "2025-11-12",
    },
    {
      id: "3",
      title: "Start Composting",
      description: "Compost organic waste at home",
      category: "waste",
      impact: 75,
      completed: false,
    },
    {
      id: "4",
      title: "Reduce Meat Consumption",
      description: "Have 2 vegetarian days per week",
      category: "lifestyle",
      impact: 200,
      completed: false,
    },
  ]);

  const [challenges] = useState<ActionChallenge[]>([
    {
      title: "Weekly CO₂ Reduction",
      description: "Target CO₂ savings this week",
      target: 500,
      current: 165,
      unit: "kg CO₂",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Green Actions",
      description: "Complete sustainable actions",
      target: 10,
      current: 7,
      unit: "actions",
      icon: <CheckCircle2 className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Learning Streak",
      description: "Consecutive days of climate learning",
      target: 30,
      current: 12,
      unit: "days",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    },
  ]);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === id
          ? {
              ...action,
              completed: !action.completed,
              completedDate: !action.completed
                ? new Date().toISOString().split("T")[0]
                : undefined,
            }
          : action
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy":
        return <Zap className="h-4 w-4" />;
      case "transport":
        return <Car className="h-4 w-4" />;
      case "waste":
        return <Recycle className="h-4 w-4" />;
      case "lifestyle":
        return <Leaf className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "energy":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "transport":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "waste":
        return "bg-green-100 text-green-700 border-green-200";
      case "lifestyle":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalImpact = actions
    .filter((action) => action.completed)
    .reduce((sum, action) => sum + action.impact, 0);

  const completedActions = actions.filter((action) => action.completed).length;

  return (
    <div className="space-y-6">
      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌱 Your Climate Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {totalImpact}
              </div>
              <div className="text-sm text-muted-foreground">kg CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {completedActions}
              </div>
              <div className="text-sm text-muted-foreground">
                Actions Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((completedActions / actions.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Challenges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {challenge.icon}
                  <div>
                    <h4 className="font-medium">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {challenge.current}/{challenge.target}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {challenge.unit}
                  </div>
                </div>
              </div>
              <Progress
                value={(challenge.current / challenge.target) * 100}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Climate Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Climate Actions</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`
                flex items-center justify-between p-4 rounded-lg border transition-colors
                ${
                  action.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Button
                  variant={action.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAction(action.id)}
                  className={
                    action.completed ? "bg-green-500 hover:bg-green-600" : ""
                  }
                >
                  {action.completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-medium ${
                        action.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {action.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(action.category)} text-xs`}
                    >
                      {getCategoryIcon(action.category)}
                      <span className="ml-1 capitalize">{action.category}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  {action.completed && action.completedDate && (
                    <p className="text-xs text-green-600 mt-1">
                      Completed on{" "}
                      {new Date(action.completedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-green-600">
                  -{action.impact} kg
                </div>
                <div className="text-xs text-muted-foreground">CO₂ Impact</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
