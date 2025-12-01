"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[25rem] flex flex-col justify-center items-center w-full">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="font-semibold text-4xl">
        <h1> Ask Ecosia AI Assistant Anything</h1>
      </div>
      <Card className="max-w-md">
        <CardContent className="p-5 text-center">
          <h1 className="text-2xl font-bold mb-2"></h1>
          <p className="text-muted-foreground">
            Your personalized climate education assistant is Here. Get ready for
            intelligent recommendations and instant answers to your climate
            questions.
          </p>
        </CardContent>
      </Card>
      <PlaceholdersAndVanishInputDemo />
    </div>
  );
}
