"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturesSectionWithBentoGrid } from "@/components/blocks/feature-section-with-bento-grid";



export default function SolutionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 text-center space-y-8">
        <div className="space-y-4">
          <TextEffect
            as="h1"
            preset="fade"
            per="char"
            className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            AI-Driven Climate Education Platform
          </TextEffect>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Empowering individuals with knowledge and tools to understand climate
            change through personalized, engaging, and actionable learning
            experiences.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Core Features Section with Bento Grid */}
      <section id="features" className="py-16 px-4 md:px-8 lg:px-16 bg-muted/30">
        <FeaturesSectionWithBentoGrid />
      </section>

      <Separator className="max-w-7xl mx-auto" />

    
    </div>
  );
}