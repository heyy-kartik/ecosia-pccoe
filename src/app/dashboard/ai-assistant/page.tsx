"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Leaf,
  Sun,
  Recycle,
  Zap,
  TreePine,
  Home,
  Bot,
  User,
  Loader2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

// Types
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: string;
}

interface AIResponse {
  message: string;
  category: string;
  confidence: number;
  followUpQuestions: string[];
  relatedTopics: string[];
  resourceRecommendations: Array<{
    title: string;
    type: "article" | "video" | "quiz" | "interactive";
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedDuration: number;
  }>;
}

interface ClimateCategory {
  name: string;
  description: string;
  topics: string[];
  ageGroups: string[];
}

// Climate categories with icons
const CATEGORY_ICONS = {
  "climate-basics": Leaf,
  "renewable-energy": Sun,
  sustainability: Recycle,
  "climate-impact": Zap,
  "climate-solutions": TreePine,
  "eco-lifestyle": Home,
};

const CATEGORY_COLORS = {
  "climate-basics":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  "renewable-energy":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  sustainability:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "climate-impact": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  "climate-solutions":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  "eco-lifestyle":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

export default function AIAssistantPage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<Record<string, ClimateCategory>>(
    {}
  );
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch categories and suggestions on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/ai-assistant");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        setSuggestedQuestions(data.suggestedQuestions);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const sendMessage = async (message: string, category?: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
      category,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          category,
          conversationHistory: messages.slice(-10),
          context: {
            ageGroup: "adult",
            knowledgeLevel: "beginner",
            learningStyle: "visual",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse: AIResponse = data.response;

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse.message,
          timestamp: new Date(),
          category: aiResponse.category,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSelectedCategory(aiResponse.category);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I&apos;m having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    const message = input?.value?.trim();
    if (message) {
      sendMessage(message, selectedCategory);
      // Clear the input immediately
      if (input) {
        input.value = "";
      }
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {message.role === "user" ? (
          <>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              <User size={16} />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100">
            <Bot size={16} />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={`flex flex-col ${
          message.role === "user" ? "items-end" : "items-start"
        } max-w-[80%]`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted border"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.category && (
            <Badge
              variant="secondary"
              className={`text-xs ${
                CATEGORY_COLORS[
                  message.category as keyof typeof CATEGORY_COLORS
                ] || ""
              }`}
            >
              {categories[message.category]?.name || message.category}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );

  const climatePlaceholders = [
    "What is the greenhouse effect?",
    "How do solar panels work?",
    "What can I do to reduce my carbon footprint?",
    "How does climate change affect biodiversity?",
    "What are the best renewable energy sources?",
    "How can I make my home more sustainable?",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <div className="p-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Ecosia Climate AI Assistant
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Ask me anything about climate change, sustainability, and
          environmental topics!
        </motion.p>
      </div>

      {/* Quick Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-6"
      >
        {Object.entries(categories)
          .slice(0, 6)
          .map(([key, category]) => {
            const IconComponent =
              CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS] || Leaf;
            const isSelected = selectedCategory === key;

            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`${isSelected ? "ring-2 ring-primary/20" : ""}`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === key ? "" : key)
                }
              >
                <IconComponent size={14} className="mr-1" />
                {category.name}
              </Button>
            );
          })}
      </motion.div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col ">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            Ecosia Chat
            {selectedCategory && (
              <Badge
                className={
                  CATEGORY_COLORS[
                    selectedCategory as keyof typeof CATEGORY_COLORS
                  ] || ""
                }
              >
                {categories[selectedCategory]?.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-green-600 opacity-50" />
                  <p className="text-muted-foreground mb-6">
                    Hi! I&apos;m your Climate AI Assistant. Ask me anything
                    about environmental topics!
                  </p>

                  {/* Suggested Questions */}
                  {suggestedQuestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Lightbulb
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          Try asking:
                        </span>
                      </div>
                      <div className="grid gap-2 max-w-md mx-auto">
                        {suggestedQuestions
                          .slice(0, 3)
                          .map((question, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="h-auto p-3 text-left justify-start text-wrap"
                              onClick={() => handleSuggestedQuestion(question)}
                            >
                              {question}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Loader2 size={16} className="animate-spin" />

                  <div className="bg-muted border rounded-2xl px-4 py-3">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Form */}
          <div className="border-t p-4">
            <PlaceholdersAndVanishInput
              placeholders={climatePlaceholders}
              onChange={() => {}}
              onSubmit={handleQuestionSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
