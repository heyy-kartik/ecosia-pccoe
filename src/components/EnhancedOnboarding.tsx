"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target, Brain, BookOpen, Zap } from "lucide-react";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: "understanding" | "action" | "awareness" | "skills";
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

interface OnboardingState {
  step: number;
  ageGroup: string;
  selectedGoals: string[];
  assessmentResponses: Array<{
    questionId: string;
    selectedAnswer: number;
    timeSpent: number;
  }>;
  learningStyle: string;
  knowledgeLevel: string;
}

export default function EnhancedOnboarding() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    ageGroup: "",
    selectedGoals: [],
    assessmentResponses: [],
    learningStyle: "",
    knowledgeLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const steps = [
    "Age Group",
    "Learning Goals",
    "Learning Style",
    "Knowledge Assessment",
    "Path Creation",
  ];

  // Fetch learning goals based on age group
  useEffect(() => {
    if (state.step === 2 && state.ageGroup) {
      fetchLearningGoals();
    }
  }, [state.step, state.ageGroup]);

  // Fetch assessment questions
  useEffect(() => {
    if (state.step === 4 && state.ageGroup) {
      fetchAssessmentQuestions();
    }
  }, [state.step, state.ageGroup]);

  const fetchLearningGoals = async () => {
    try {
      const response = await fetch(
        `/api/onboarding?step=goals&ageGroup=${state.ageGroup}`
      );
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      setQuestionStartTime(Date.now());
      const response = await fetch(
        `/api/onboarding?step=assessment&ageGroup=${state.ageGroup}`
      );
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const timeSpent = Date.now() - questionStartTime;
    const newResponse = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: answerIndex,
      timeSpent,
    };

    setState((prev) => ({
      ...prev,
      assessmentResponses: [...prev.assessmentResponses, newResponse],
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      submitAssessment([...state.assessmentResponses, newResponse]);
    }
  };

  const submitAssessment = async (
    responses: typeof state.assessmentResponses
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "assessment",
          data: { responses, ageGroup: state.ageGroup },
        }),
      });
      const result = await response.json();

      setState((prev) => ({
        ...prev,
        knowledgeLevel: result.knowledgeLevel,
        step: 5,
      }));
    } catch (error) {
      console.error("Assessment submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "create_path",
          data: {
            ageGroup: state.ageGroup,
            selectedGoals: state.selectedGoals,
            knowledgeLevel: state.knowledgeLevel,
            learningStyle: state.learningStyle,
          },
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Path creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                What&apos;s your age group?
              </h2>
              <p className="text-muted-foreground">
                We&apos;ll customize content just for you
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  value: "children",
                  label: "Children",
                  subtitle: "6-12 years",
                  icon: "🧒",
                },
                {
                  value: "teens",
                  label: "Teenagers",
                  subtitle: "13-17 years",
                  icon: "🧑‍🎓",
                },
                {
                  value: "adults",
                  label: "Adults",
                  subtitle: "18+ years",
                  icon: "👩‍💼",
                },
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    state.ageGroup === option.value
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() =>
                    setState((prev) => ({ ...prev, ageGroup: option.value }))
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{option.icon}</div>
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.subtitle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setState((prev) => ({ ...prev, step: 2 }))}
                disabled={!state.ageGroup}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                What do you want to learn?
              </h2>
              <p className="text-muted-foreground">
                Select your learning goals (choose multiple)
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all ${
                    state.selectedGoals.includes(goal.id)
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      selectedGoals: prev.selectedGoals.includes(goal.id)
                        ? prev.selectedGoals.filter((id) => id !== goal.id)
                        : [...prev.selectedGoals, goal.id],
                    }));
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      {state.selectedGoals.includes(goal.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setState((prev) => ({ ...prev, step: 1 }))}
              >
                Back
              </Button>
              <Button
                onClick={() => setState((prev) => ({ ...prev, step: 3 }))}
                disabled={state.selectedGoals.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                How do you learn best?
              </h2>
              <p className="text-muted-foreground">
                This helps us recommend the right content format
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  value: "visual",
                  label: "Visual Learner",
                  description: "Videos, images, charts, and diagrams",
                  icon: <BookOpen className="h-6 w-6" />,
                },
                {
                  value: "auditory",
                  label: "Auditory Learner",
                  description: "Podcasts, discussions, and audio content",
                  icon: <Zap className="h-6 w-6" />,
                },
                {
                  value: "reading",
                  label: "Reading/Writing",
                  description: "Articles, documents, and text-based content",
                  icon: <Target className="h-6 w-6" />,
                },
                {
                  value: "kinesthetic",
                  label: "Hands-on Learner",
                  description: "Interactive activities and simulations",
                  icon: <Brain className="h-6 w-6" />,
                },
              ].map((style) => (
                <Card
                  key={style.value}
                  className={`cursor-pointer transition-all ${
                    state.learningStyle === style.value
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      learningStyle: style.value,
                    }))
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {style.icon}
                      <CardTitle className="text-lg">{style.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{style.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setState((prev) => ({ ...prev, step: 2 }))}
              >
                Back
              </Button>
              <Button
                onClick={() => setState((prev) => ({ ...prev, step: 4 }))}
                disabled={!state.learningStyle}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 4:
        if (questions.length === 0) {
          return (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p>Loading assessment questions...</p>
            </div>
          );
        }

        const question = questions[currentQuestion];
        const progress = (currentQuestion / questions.length) * 100;

        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{question.question}</CardTitle>
                <CardDescription>Choose the best answer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerQuestion(index)}
                    disabled={loading}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setState((prev) => ({ ...prev, step: 3 }))}
                disabled={loading || currentQuestion > 0}
              >
                Back
              </Button>
              <div className="text-sm text-muted-foreground">
                Answer to continue
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Assessment Complete!</h2>
              <div className="bg-muted rounded-lg p-6 space-y-3">
                <p>
                  <strong>Knowledge Level:</strong> {state.knowledgeLevel}
                </p>
                <p>
                  <strong>Learning Style:</strong> {state.learningStyle}
                </p>
                <p>
                  <strong>Goals Selected:</strong> {state.selectedGoals.length}
                </p>
              </div>
              <p className="text-muted-foreground">
                We&apos;re creating your personalized learning path based on
                your assessment results.
              </p>
            </div>

            <Button
              onClick={createLearningPath}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "Creating Your Path..." : "Start Learning Journey"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Welcome to ECOSIA PCCOE</h1>
              <span className="text-sm text-muted-foreground">
                Step {state.step} of {steps.length}
              </span>
            </div>
            <Progress
              value={(state.step / steps.length) * 100}
              className="h-2"
            />
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-lg border p-8">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
}
