"use client";

import { useMemo, useState } from "react";
import { Lightbulb, PlugZap, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASELINE_KWH = 18.4;
const DAILY_GOAL = 14;

const breakdown = [
  { label: "Lighting", usage: 4.8, goal: 2.4 },
  { label: "Appliances", usage: 6.5, goal: 4 },
  { label: "Cooling", usage: 5.1, goal: 4.5 },
  { label: "Standby", usage: 2.0, goal: 1.1 },
];

const quickWins = [
  "Unplug chargers after use",
  "Batch cook with induction",
  "Air dry clothes for one load",
  "Set AC at 25°C eco mode",
];

const milestones = [
  { title: "Energy audit", detail: "Mapped top 3 power hogs", status: "done" },
  { title: "Smart timer setup", detail: "Scheduled fans & lamps", status: "active" },
  { title: "Roommate pact", detail: "Shared energy chart in chat", status: "upcoming" },
  { title: "Bill comparison", detail: "Review next month statements", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 15.2, note: "Killed standby strips, moderate AC use" },
  { date: "2025-11-30", usage: 16.8, note: "Ran laundry at night" },
  { date: "2025-11-29", usage: 18.3, note: "Baseline reading" },
];

type Entry = (typeof initialEntries)[number];

export default function EnergySavingMissionPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const averageUsage = useMemo(() => {
    if (!entries.length) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.usage, 0);
    return Math.round((total / entries.length) * 10) / 10;
  }, [entries]);

  const goalProgress = Math.min(100, Math.round((averageUsage / DAILY_GOAL) * 100));
  const savings = Math.max(0, Math.round((BASELINE_KWH - averageUsage) * 10) / 10);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;
    const usageNumber = parseFloat(form.usage);
    if (Number.isNaN(usageNumber)) return;

    setEntries((prev) => [{ date: form.date, usage: usageNumber, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit gap-1">
          <Lightbulb className="size-4" />
          20% Power Down
        </Badge>
        <h1 className="text-2xl font-semibold">Energy Saving Mission</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Rewire daily routines to cut electricity use in just 24 hours. Track kWh, surface standby leaks, and gamify
          energy discipline with your crew.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <PlugZap className="size-4 text-primary" />
              Avg. kWh today
            </CardTitle>
            <CardDescription>Goal: {DAILY_GOAL} kWh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{averageUsage} kWh</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">Lower = cooler planet + smaller bill.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Savings vs. baseline
            </CardTitle>
            <CardDescription>Baseline: {BASELINE_KWH} kWh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{savings} kWh</div>
            <p className="text-xs text-muted-foreground">≈ {Math.round(savings * 0.8)} hours of laptop runtime.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Share insight
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-sky-500" />
              Next tweak
            </CardTitle>
            <CardDescription>Stack quick wins today</CardDescription>
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
              View playbook
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Energy log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add meter snapshot</CardTitle>
              <CardDescription>Record total kWh for the day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage">kWh used</Label>
                  <Input
                    id="usage"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.usage}
                    onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Adjustment made</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Switched to ceiling fan"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log energy
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
                    {entry.usage} kWh
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
                <CardTitle className="text-base">Usage breakdown</CardTitle>
                <CardDescription>Balance essential vs. optional loads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {breakdown.map((item) => {
                  const percent = Math.min(100, Math.round((item.usage / item.goal) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.usage} kWh / {item.goal} kWh
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
                <CardDescription>Pick one tactic before bedtime.</CardDescription>
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
          <CardDescription>Document the momentum boosts.</CardDescription>
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

