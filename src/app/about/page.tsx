"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Kartik Jagdale",
    description:
      "Development. Leading the technical implementation and architecture of the project. Responsible for full-stack development and ensuring code quality.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Kartik Jagdale - Development
      </div>
    ),
  },
  {
    title: "Dhani Shende",
    description:
      "Development. Contributing to the frontend and backend development. Focused on creating responsive and user-friendly interfaces.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Dhani Shende - Development
      </div>
    ),
  },
  {
    title: "Paurnima Jagdale",
    description:
      "UI/UX and Automation. Designing intuitive user experiences and ensuring the application is robust through automated testing strategies.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Paurnima Jagdale - UI/UX & Automation
      </div>
    ),
  },
  {
    title: "Kaushal Gadekar",
    description:
      "Testing. Ensuring the quality and reliability of the application through rigorous testing and bug reporting.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Kaushal Gadekar - Testing
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="">
      <StickyScroll content={content} />
    </div>
  );
}
