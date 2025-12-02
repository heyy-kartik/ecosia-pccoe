"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Battery,
  Globe,
  Recycle,
  Sun,
  TestTube,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import OpinionStageEmbed from "@/components/OpinionStageEmbed";
const quizList = [
  {
    title: "Climate Basics",
    description:
      "Understand greenhouse gases, climate change and sustainability.",
    icon: <Globe size={22} />,
    difficulty: "Easy",
    widgetId: "e48b1d0e-b406-4677-bba6-3f098ea69e77",
  },
  {
    title: "Renewable Energy",
    description:
      "Test your knowledge on solar, wind, hydro and future energy sources.",
    icon: <Sun size={22} />,
    difficulty: "Medium",
    widgetId: "f59c2e1f-c517-5788-ccb7-4f109fb7ae88",
  },
  {
    title: "Carbon Footprint",
    description: "Learn how daily actions impact Earth's carbon cycle.",
    icon: <Recycle size={22} />,
    difficulty: "Easy",
    widgetId: "g60d3f2g-d628-6899-ddc8-5f21afb8bf99",
  },
  {
    title: "Global Warming Causes",
    description: "Explore the science behind rising global temperatures.",
    icon: <Battery size={22} />,
    difficulty: "Hard",
    widgetId: "h71e4g3h-e739-79aa-eed9-6f32bgc9cgaa",
  },
  {
    title: "Ecosystems & Biodiversity",
    description:
      "Understanding how ecosystems maintain balance and why species matter.",
    icon: <Leaf size={22} />,
    difficulty: "Medium",
    widgetId: "i82f5h4i-f84a-8abb-ffea-7f43chd0dhbb",
  },
  {
    title: "Environmental Chemistry",
    description:
      "Pollutants, chemical reactions and the impact on air + water.",
    icon: <TestTube size={22} />,
    difficulty: "Hard",
    widgetId: "j93g6i5j-g95b-9bcc-gffb-8f54die1eicc",
  },
  {
    title: "Sustainable Living",
    description: "Practical ways to adopt an eco-friendly lifestyle.",
    icon: <Leaf size={22} />,
    difficulty: "Easy",
    widgetId: "k04h7j6k-ha6c-acdd-hggc-9f65ejf2fjdd",
  },
  {
    title: "Climate Policies",
    description: "Understand global climate agreements and policymaking.",
    icon: <Globe size={22} />,
    difficulty: "Medium",
    widgetId: "l15i8k7l-ib7d-bdee-ihgd-ag76fkg3gkee",
  },
  {
    title: "Ocean Conservation",
    description: "Learn about marine ecosystems and protection efforts.",
    icon: <Recycle size={22} />,
    difficulty: "Medium",
    widgetId: "m26j9l8m-jc8e-ceff-jihge-bh87glh4hlff",
  },
  {
    title: "Wildlife Protection",
    description: "Explore endangered species and conservation strategies.",
    icon: <Sun size={22} />,
    difficulty: "Hard",
    widgetId: "n37ka9n-kd9f-dfgg-kjhif-ci98hmi5imgg",
  },
];

export default function QuizzesPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>("");

  const handleStartQuiz = (widgetId: string, title: string) => {
    setSelectedQuiz(widgetId);
    setSelectedQuizTitle(title);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setSelectedQuizTitle("");
  };

  if (selectedQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToQuizzes}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Quizzes
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {selectedQuizTitle}
          </h1>
        </div>
        <div className="w-full">
          <OpinionStageEmbed widgetId={selectedQuiz} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quizzes</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Test your climate knowledge. Smart AI will recommend harder or easier
          topics based on your results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {quizList.map((quiz, index) => (
          <motion.div
            key={quiz.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <Card className="rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[180px]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-green-600">{quiz.icon}</div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {quiz.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {quiz.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <span
                  className={
                    quiz.difficulty === "Easy"
                      ? "text-green-600 text-sm font-medium"
                      : quiz.difficulty === "Medium"
                      ? "text-yellow-600 text-sm font-medium"
                      : "text-red-600 text-sm font-medium"
                  }
                >
                  {quiz.difficulty}
                </span>

                <Button
                  onClick={() => handleStartQuiz(quiz.widgetId, quiz.title)}
                  className="flex items-center gap-2"
                >
                  Start
                  <ChevronRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
