"use client";

import { useMemo, useState } from "react";
import { Binoculars, Camera, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OBS_TARGET = 12;

const habitatMix = [
  { label: "Trees", usage: 5, goal: 5 },
  { label: "Birds", usage: 3, goal: 4 },
  { label: "Insects", usage: 4, goal: 3 },
  { label: "Human impacts", usage: 2, goal: 2 },
];

const quickWins = [
  "Do a sit spot for 10 minutes",
  "Sketch leaf shapes, not just photos",
  "Record soundscapes with your phone",
  "Ask neighbors about seasonal shifts",
];

const milestones = [
  { title: "Site selected", detail: "Mapped 200m radius study area", status: "done" },
  { title: "Observation kit", detail: "Packed notebook + reusable jars", status: "active" },
  { title: "Mini transect", detail: "Lay 10m string for sampling", status: "upcoming" },
  { title: "Community share", detail: "Add findings to campus board", status: "upcoming" },
];

const initialEntries = [
  { date: "2025-12-01", usage: 5, note: "Observed 2 pollinators + 1 invasive plant" },
  { date: "2025-11-29", usage: 4, note: "Morning bird calls recorded" },
  { date: "2025-11-27", usage: 3, note: "Baseline habitat sketch" },
];

type Entry = (typeof initialEntries)[number];

export default function LocalEcosystemStudyPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState({ date: "", usage: "", note: "" });

  const totalObservations = useMemo(() => entries.reduce((sum, entry) => sum + entry.usage, 0), [entries]);
  const goalProgress = Math.min(100, Math.round((totalObservations / OBS_TARGET) * 100));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.date || !form.usage) return;
    const count = parseInt(form.usage, 10);
    if (Number.isNaN(count)) return;

    setEntries((prev) => [{ date: form.date, usage: count, note: form.note }, ...prev].slice(0, 6));
    setForm({ date: "", usage: "", note: "" });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit gap-1">
          <Binoculars className="size-4" />
          Field Journal
        </Badge>
        <h1 className="text-2xl font-semibold">Local Ecosystem Study</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Adopt a micro habitat—campus courtyard, neighborhood park, rooftop garden. Capture biodiversity signals,
          human-made pressures, and reflections in a clean dashboard.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="size-4 text-primary" />
              Total observations
            </CardTitle>
            <CardDescription>Goal: {OBS_TARGET} unique notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">{totalObservations}</div>
            <Progress value={goalProgress} />
            <p className="text-xs text-muted-foreground">Aim for 3 diverse entries per outing.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Pattern insights
            </CardTitle>
            <CardDescription>Highlight 1 surprise each visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-semibold text-emerald-600">{entries[0]?.usage ?? 0}</div>
            <p className="text-xs text-muted-foreground">Latest outing observations logged.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Export log
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4 text-sky-500" />
              Next exploration
            </CardTitle>
            <CardDescription>Switch senses & perspectives</CardDescription>
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
              View prompt pack
            </Button>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Observation log</TabsTrigger>
          <TabsTrigger value="insights">Insight view</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add field note</CardTitle>
              <CardDescription>Count distinct observations (species, behavior, impact, etc.).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count"># Observations</Label>
                  <Input
                    id="count"
                    type="number"
                    min="0"
                    value={form.usage}
                    onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Most interesting detail</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Ant trail detouring around plastic"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <Button type="submit" className="md:col-span-4 w-full md:w-auto">
                  Log note
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
                    {entry.usage} obs
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
                <CardTitle className="text-base">Habitat mix</CardTitle>
                <CardDescription>Is your log balanced across life forms?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {habitatMix.map((item) => {
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
                  Exploration prompts
                </CardTitle>
                <CardDescription>Use these when your curiosity dips.</CardDescription>
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
          <CardDescription>Anchor the project in story-worthy artifacts.</CardDescription>
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

