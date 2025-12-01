"use client";

import { useMemo, useState } from "react";
import { Footprints, Globe, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WEEKLY_GOAL = 45; // kg CO2e
const BASELINE = 52;

const breakdown = [
  { label: "Transport", usage: 18, goal: 14 },
  { label: "Food", usage: 15, goal: 12 },
  { label: "Home energy", usage: 11, goal: 10 },
  { label: "Shopping", usage: 8, goal: 6 },
];

const quickWins = [
  "Switch two rides to transit or cycling",
  "Plan one plant-based dinner",
  "Delay non-essential online orders",
  "Bundle errands into one trip",
];

const milestones = [
  { title: "Footprint audit", detail: "Calculated categories with class toolkit", status: "done" },
  { title: "Transit swap", detail: "Car-free for 2 days straight", status: "active" },
  { title: "Meal prep sprint", detail: "Zero-delivery dinner week", status: "upcoming" },
  { title: "Peer challenge", detail: "Invite 3 friends to compare charts", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 46, note: "Biked to campus + low energy weekend" },
  { date: "2025-11-27", usage: 48, note: "Skipped one takeout order" },
  { date: "2025-11-24", usage: 52, note: "Baseline footprint" },
];

type Entry = (typeof initialEntries)[number];

export default function CarbonFootprintChallengePage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const latestFootprint = entries[0]?.usage ?? 0;
  const delta = Math.max(0, BASELINE - latestFootprint);
  const goalProgress = Math.min(100, Math.round((latestFootprint / WEEKLY_GOAL) * 100));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;
    const kg = parseFloat(form.usage);
    if (Number.isNaN(kg)) return;

    setEntries((prev) => [{ date: form.date, usage: kg, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit gap-1">
          <Footprints className="size-4" />
          Weekly Impact
        </Badge>
        <h1 className="text-2xl font-semibold">Carbon Footprint Challenge</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Run a mini audit, log weekly totals, and experiment with low-carbon swaps that make the biggest dent in your
          personal footprint.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              Latest footprint
            </CardTitle>
            <CardDescription>Goal: {WEEKLY_GOAL} kg CO₂e</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{latestFootprint} kg</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">Stay below goal for two consecutive weeks.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Reduction vs. baseline
            </CardTitle>
            <CardDescription>Baseline: {BASELINE} kg CO₂e</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{delta} kg</div>
            <p className="text-xs text-muted-foreground">≈ {Math.round(delta * 4)} km of car travel.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Share snapshot
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-sky-500" />
              Next bold move
            </CardTitle>
            <CardDescription>Choose 1 lever per week</CardDescription>
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
              Open playbook
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Weekly log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add weekly total</CardTitle>
              <CardDescription>Use calculator values or app screenshots.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Week ending</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage">kg CO₂e</Label>
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
                  <Label htmlFor="note">Main adjustment</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Took train instead of car"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log footprint
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
                    {entry.usage} kg
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
                <CardDescription>Double down on your biggest lever.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {breakdown.map((item) => {
                  const percent = Math.min(100, Math.round((item.usage / item.goal) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.usage} kg / {item.goal} kg
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
                <CardDescription>Choose your experiment of the week.</CardDescription>
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
          <CardDescription>Keep the streak, share the story.</CardDescription>
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

