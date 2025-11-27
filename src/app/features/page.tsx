"use client";
import { FeatureSteps } from "@/components/feature-section";

const features = [
  {
    title: "Take Assessment",
    content:
      "Start with our AI-powered assessment to determine your current climate knowledge and learning style preferences.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Personalized Learning Path",
    content:
      "Get AI-curated content tailored to your age group, interests, and knowledge level for optimal learning.",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Interactive Learning",
    content:
      "Engage with climate simulations, quizzes, and real-world case studies to deepen your understanding.",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Take Action",
    content:
      "Apply your knowledge through community projects and personal climate action plans with measurable impact.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
];

export default function FeatureStepsDemo() {
  return (
    <FeatureSteps
      features={features}
      title="Your Climate Learning Journey"
      autoPlayInterval={5000}
      imageHeight="h-[500px]"
    />
  );
}
