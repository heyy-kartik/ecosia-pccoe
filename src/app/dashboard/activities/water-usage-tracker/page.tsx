"use client";

import { useMemo, useState } from "react";
import { Droplets, Leaf, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASELINE_USAGE = 150;
const DAILY_GOAL = 110;

const breakdown = [
  { label: "Showers & hygiene", usage: 38, goal: 30 },
  { label: "Cooking & drinking", usage: 22, goal: 20 },
  { label: "Laundry & cleaning", usage: 28, goal: 25 },
  { label: "Plants & misc.", usage: 14, goal: 12 },
];

const quickWins = [
  "Cut shower time by 2 minutes",
  "Collect rinse water for plants",
  "Run laundry on eco-cycle",
  "Use a full sink when washing dishes",
];

const milestones = [
  { title: "Baseline logged", detail: "Understand current usage pattern", status: "done" },
  { title: "Week 1 check-in", detail: "Reduce 5% by swapping habits", status: "active" },
  { title: "Week 2 adjustment", detail: "Introduce greywater uses", status: "upcoming" },
  { title: "Share your impact", detail: "Inspire friends or class", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 118, note: "Focused on shorter showers" },
  { date: "2025-11-30", usage: 124, note: "Laundry day increase" },
  { date: "2025-11-29", usage: 120, note: "Baseline reading" },
];

type Entry = (typeof initialEntries)[number];

export default function WaterUsageTrackerPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const averageUsage = useMemo(() => {
    if (!entries.length) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.usage, 0);
    return Math.round(total / entries.length);
  }, [entries]);

  const goalProgress = Math.min(100, Math.round((averageUsage / DAILY_GOAL) * 100));
  const savings = Math.max(0, BASELINE_USAGE - averageUsage);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;

    const usageNumber = parseInt(form.usage, 10);
    if (Number.isNaN(usageNumber)) return;

    setEntries((prev) => [{ date: form.date, usage: usageNumber, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge className="w-fit gap-1" variant="secondary">
          <Droplets className="size-4" />
          Daily Impact Activity
        </Badge>
        <h1 className="text-2xl font-semibold">Water Usage Tracker</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Log your daily water use, surface hidden inefficiencies, and act on micro-habits that steadily shrink your
          footprint. This tracker keeps the experience simple, visual, and encouraging.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="size-4 text-primary" />
              Today&apos;s average
            </CardTitle>
            <CardDescription>Goal: {DAILY_GOAL} L</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{averageUsage} L</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">You are at {goalProgress}% of the daily target.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="size-4 text-emerald-500" />
              Savings vs. baseline
            </CardTitle>
            <CardDescription>Baseline: {BASELINE_USAGE} L</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{savings} L</div>
            <p className="text-xs text-muted-foreground">Great! This equals roughly {Math.round(savings / 2)} bottles.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Share progress
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-sky-500" />
              Next action
            </CardTitle>
            <CardDescription>Small wins stack fast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              {quickWins.slice(0, 2).map((tip) => (
                <li key={tip} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary/70" />
                  {tip}
                </li>
              ))}
            </ul>
            <Button size="sm" variant="secondary" className="w-fit">
              View actions
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Daily log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add today&apos;s entry</CardTitle>
              <CardDescription>Keep it simple: one total number per day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage">Liters used</Label>
                  <Input
                    id="usage"
                    type="number"
                    min="0"
                    value={form.usage}
                    onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Micro-note</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Took a bucket bath"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log water use
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {entries.map((entry) => (
              <Card key={entry.date} className="border-muted">
                <CardContent className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium">{entry.date}</p>
                    <p className="text-xs text-muted-foreground">{entry.note || "No note added"}</p>
                  </div>
                  <Badge variant="outline" className="text-base py-1 px-3">
                    {entry.usage} L
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category breakdown</CardTitle>
                <CardDescription>Compare each habit with its micro-goal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {breakdown.map((item) => {
                  const percent = Math.min(100, Math.round((item.usage / item.goal) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.usage} L / {item.goal} L
                        </span>
                      </div>
                      <Progress value={percent} className={percent > 100 ? "bg-destructive/20" : undefined} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Smart nudges
                </CardTitle>
                <CardDescription>Pick one habit to focus on today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickWins.map((tip) => (
                  <div key={tip} className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                    {tip}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Milestones</CardTitle>
          <CardDescription>Track your momentum and celebrate progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span
                className={`mt-1 size-2 rounded-full ${
                  item.status === "done"
                    ? "bg-emerald-500"
                    : item.status === "active"
                    ? "bg-primary"
                    : "bg-muted-foreground/40"
                }`}
              />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

