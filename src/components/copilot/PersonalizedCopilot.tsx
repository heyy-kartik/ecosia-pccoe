"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CopilotPayload, LearnerSnapshot } from "@/types/copilot";
import { Loader2, Sparkles, RefreshCw, Target, Flame } from "lucide-react";

type CopilotResponse = {
  snapshot: LearnerSnapshot;
  recommendations: CopilotPayload;
  cached: boolean;
};

interface PersonalizedCopilotProps {
  className?: string;
}

export function PersonalizedCopilot({ className }: PersonalizedCopilotProps) {
  const [data, setData] = useState<CopilotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusArea, setFocusArea] = useState<string | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRecommendations = useCallback(
    async (overrideFocus?: string) => {
      setLoading((prev) => prev && !data);
      setIsRefreshing(true);
      setError(null);

      try {
        const params =
          overrideFocus || focusArea
            ? `?focus=${encodeURIComponent(overrideFocus || focusArea || "")}`
            : "";
        const res = await fetch(`/api/copilot${params}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Unable to load copilot guidance");
        }

        const payload: CopilotResponse = await res.json();
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [focusArea, data]
  );

  useEffect(() => {
    void fetchRecommendations();
  }, [fetchRecommendations]);

  const focusOptions = useMemo(() => {
    if (!data?.snapshot) return [];
    const combined = [
      ...data.snapshot.improvementAreas,
      ...data.snapshot.focusAreas.map((item) => item.title),
    ];
    return Array.from(new Set(combined)).slice(0, 6);
  }, [data]);

  const snapshotTotals = data?.snapshot?.totals;

  return (
    <Card className={cn("border-primary/20 shadow-lg", className)}>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Personalized Learning Copilot
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-curated guidance based on your recent learning signals.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={focusArea ?? ""}
            onValueChange={(value) => {
              const val = value || undefined;
              setFocusArea(val);
              void fetchRecommendations(val);
            }}
            disabled={!focusOptions.length}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Auto focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto focus</SelectItem>
              {focusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRecommendations()}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {loading ? (
          <SkeletonState />
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
            <Button
              variant="link"
              size="sm"
              className="pl-1"
              onClick={() => fetchRecommendations()}
            >
              Try again
            </Button>
          </div>
        ) : data ? (
          <>
            <section className="rounded-xl border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
              {data.recommendations.summary}
            </section>

            {snapshotTotals && (
              <div className="grid gap-3 sm:grid-cols-3">
                <SnapshotPill
                  label="Completed"
                  value={snapshotTotals.completed}
                />
                <SnapshotPill
                  label="In progress"
                  value={snapshotTotals.inProgress}
                  tone="warning"
                />
                <SnapshotPill
                  label="Upcoming"
                  value={snapshotTotals.upcoming}
                  tone="neutral"
                />
              </div>
            )}

            <section className="space-y-3">
              <SectionHeader
                icon={<Target className="h-4 w-4" />}
                title="Priority focus"
              />
              <div className="grid gap-3 lg:grid-cols-3">
                {data.recommendations.priorities.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border bg-background p-4 shadow-sm"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.reason}
                    </p>
                    <Badge variant="secondary" className="mt-2 w-fit text-xs">
                      {item.suggestedResource}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <SectionHeader
                icon={<Flame className="h-4 w-4" />}
                title="Quick actions"
              />
              <div className="grid gap-3 md:grid-cols-3">
                {data.recommendations.actions.map((action) => (
                  <div
                    key={action.label}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border bg-primary/5 px-4 py-3 text-sm text-primary">
              {data.recommendations.encouragement}
              {data.cached && (
                <span className="ml-2 text-xs text-primary/70">
                  (from cache)
                </span>
              )}
            </section>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {icon}
      {title}
    </div>
  );
}

function SnapshotPill({
  label,
  value,
  tone = "success",
}: {
  label: string;
  value: number;
  tone?: "success" | "warning" | "neutral";
}) {
  const colors =
    tone === "success"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"
      : tone === "warning"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200"
      : "bg-muted text-foreground";

  return (
    <div className={cn("rounded-lg px-4 py-3 text-sm", colors)}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function SkeletonState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-20 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
