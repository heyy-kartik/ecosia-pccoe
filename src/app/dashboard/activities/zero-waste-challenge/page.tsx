"use client";

import { useMemo, useState } from "react";
import { Recycle, Trash2, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASELINE_WASTE = 620; // grams
const DAILY_GOAL = 200;

const breakdown = [
  { label: "Food scraps", usage: 220, goal: 120 },
  { label: "Packaging", usage: 180, goal: 40 },
  { label: "Paper", usage: 90, goal: 30 },
  { label: "Misc. plastics", usage: 130, goal: 10 },
];

const quickWins = [
  "Carry a reusable cutlery + straw kit",
  "Swap packaged snacks with bulk refills",
  "Keep a mini compost jar on the counter",
  "Say no to receipts & single-use cups",
];

const milestones = [
  { title: "Kit assembled", detail: "Prepared reusables the night before", status: "done" },
  { title: "Compost ready", detail: "Setup countertop bin for scraps", status: "active" },
  { title: "Neighborhood audit", detail: "Log common trash hotspots", status: "upcoming" },
  { title: "Reflect & share", detail: "Document a zero-waste recipe", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 240, note: "Skipped takeaway lid, still had snack wrapper" },
  { date: "2025-11-30", usage: 280, note: "Meal prepped; composted veggie peels" },
  { date: "2025-11-29", usage: 310, note: "Baseline grocery day" },
];

type Entry = (typeof initialEntries)[number];

export default function ZeroWasteChallengePage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const averageWaste = useMemo(() => {
    if (!entries.length) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.usage, 0);
    return Math.round(total / entries.length);
  }, [entries]);

  const goalProgress = Math.min(100, Math.round((averageWaste / DAILY_GOAL) * 100));
  const wasteSaved = Math.max(0, BASELINE_WASTE - averageWaste);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;
    const grams = parseInt(form.usage, 10);
    if (Number.isNaN(grams)) return;

    setEntries((prev) => [{ date: form.date, usage: grams, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit gap-1">
          <Recycle className="size-4" />
          24h Lifestyle Sprint
        </Badge>
        <h1 className="text-2xl font-semibold">One-Day Zero Waste Challenge</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Eliminate disposables, track grams of trash avoided, and uncover the friction points that prevent a consistent
          low-waste routine.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Trash2 className="size-4 text-primary" />
              Waste per day
            </CardTitle>
            <CardDescription>Goal: {DAILY_GOAL} g</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{averageWaste} g</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">Aim for a mason jar or less of trash.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Saved vs. baseline
            </CardTitle>
            <CardDescription>Baseline: {BASELINE_WASTE} g</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{wasteSaved} g</div>
            <p className="text-xs text-muted-foreground">Equal to ~{Math.round(wasteSaved / 15)} plastic forks.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Celebrate win
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-amber-500" />
              Next blocker
            </CardTitle>
            <CardDescription>Focus on one swap at a time</CardDescription>
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
              View swaps
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Waste log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add today&apos;s jar</CardTitle>
              <CardDescription>Track total grams of trash produced.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grams">Grams generated</Label>
                  <Input
                    id="grams"
                    type="number"
                    min="0"
                    value={form.usage}
                    onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Notable swap</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Borrowed reusable cup"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log waste
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
                    {entry.usage} g
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
                <CardTitle className="text-base">Material breakdown</CardTitle>
                <CardDescription>Spot which category keeps creeping back.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {breakdown.map((item) => {
                  const percent = Math.min(100, Math.round((item.usage / item.goal) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.usage} g / {item.goal} g
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
                  Micro habits
                </CardTitle>
                <CardDescription>Your go-to list for the next outing.</CardDescription>
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
          <CardDescription>Highlight the confidence boosts.</CardDescription>
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

