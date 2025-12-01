"use client";

import { useMemo, useState } from "react";
import { TreePine, Sun, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GROWTH_TARGET = 25; // cm increase goal

const careStats = [
  { label: "Sunlight hours", usage: 6, goal: 8 },
  { label: "Soil moisture", usage: 58, goal: 60 },
  { label: "Fertilizer schedule", usage: 2, goal: 2 },
  { label: "Observation days", usage: 5, goal: 7 },
];

const quickWins = [
  "Loosen soil gently once a week",
  "Water early morning to limit evaporation",
  "Rotate pot 90° for even sunlight",
  "Use mulch from dried leaves nearby",
];

const milestones = [
  { title: "Planting day", detail: "Documented species + location", status: "done" },
  { title: "Week 1 check", detail: "Captured first growth snapshot", status: "active" },
  { title: "Week 3 support", detail: "Added stakes/guard if needed", status: "upcoming" },
  { title: "Month 1 share", detail: "Post story to inspire friends", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 14, note: "Noticed 2 new leaves" },
  { date: "2025-11-28", usage: 11, note: "Soil stayed moist; added mulch" },
  { date: "2025-11-24", usage: 9, note: "Baseline planting height" },
];

type Entry = (typeof initialEntries)[number];

export default function PlantATreePage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const growthGain = useMemo(() => {
    if (!entries.length) return 0;
    const latest = entries[0]?.usage ?? 0;
    const earliest = entries[entries.length - 1]?.usage ?? 0;
    return latest - earliest;
  }, [entries]);

  const goalProgress = Math.min(100, Math.round((growthGain / GROWTH_TARGET) * 100));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;
    const cm = parseFloat(form.usage);
    if (Number.isNaN(cm)) return;

    setEntries((prev) => [{ date: form.date, usage: cm, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit gap-1">
          <TreePine className="size-4" />
          30-day Nature Log
        </Badge>
        <h1 className="text-2xl font-semibold">Plant a Tree Activity</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Track growth, care habits, and key observations for your sapling. Micro-logs keep the routine engaging while
          proving impact over weeks.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="size-4 text-primary" />
              Growth gained
            </CardTitle>
            <CardDescription>Goal: +{GROWTH_TARGET} cm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{growthGain} cm</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">Keep gentle logs every 3–4 days.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Care consistency
            </CardTitle>
            <CardDescription>Sunlight + moisture averages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{Math.round(goalProgress / 10)} / 10</div>
            <p className="text-xs text-muted-foreground">Score reflects hydration + protection efforts.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Share photo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-sky-500" />
              Next care tip
            </CardTitle>
            <CardDescription>Layer small interventions</CardDescription>
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
              Open care guide
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Growth log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add measurement</CardTitle>
              <CardDescription>Measure height from soil line to highest leaf.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.usage}
                    onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Observation</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Added bamboo support"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log growth
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
                    {entry.usage} cm
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
                <CardTitle className="text-base">Care stats</CardTitle>
                <CardDescription>Compare routine with checklist goals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {careStats.map((item) => {
                  const percent = Math.min(100, Math.round((item.usage / item.goal) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.usage} / {item.goal}
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
                  Care hacks
                </CardTitle>
                <CardDescription>Pick the hack you can try today.</CardDescription>
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
          <CardDescription>Celebrate small moments to stay consistent.</CardDescription>
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

