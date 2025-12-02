// Copilot Types for Personalized Learning Assistant

export interface LearnerSnapshot {
  totals: {
    completed: number;
    inProgress: number;
    upcoming: number;
  };
  focusAreas: Array<{
    id: number;
    title: string;
    status: string;
    type: string;
    reviewer?: string;
  }>;
  strengths: string[];
  improvementAreas: string[];
  streakDays: number;
  lastActive: string;
}

export interface CopilotPayload {
  summary: string;
  priorities: Array<{
    title: string;
    reason: string;
    suggestedResource: string;
  }>;
  actions: Array<{
    label: string;
    description: string;
  }>;
  encouragement: string;
}

export interface CopilotApiResponse {
  snapshot: LearnerSnapshot;
  recommendations: CopilotPayload;
  cached: boolean;
}