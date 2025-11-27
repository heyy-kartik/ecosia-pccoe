"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Feature {
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center">
          {title}
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="order-2 md:order-1 space-y-8">
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>
                  {currentFeature + 1} of {features.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <motion.div
                  className="bg-primary h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentFeature + 1) / features.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8 cursor-pointer"
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.3,
                  x: index === currentFeature ? 0 : -10,
                  scale: index === currentFeature ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setCurrentFeature(index)}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  className={cn(
                    "relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                    index === currentFeature
                      ? "bg-primary border-primary text-primary-foreground"
                      : index < currentFeature
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted border-muted-foreground"
                  )}
                  animate={{
                    scale: index === currentFeature ? 1.1 : 1,
                    rotate: index === currentFeature ? [0, 360] : 0,
                  }}
                  transition={{
                    scale: { duration: 0.3 },
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  }}
                >
                  {/* Animated progress ring for current step */}
                  {index === currentFeature && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <AnimatePresence mode="wait">
                    {index <= currentFeature ? (
                      <motion.span
                        key="check"
                        className="text-lg font-bold"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key="number"
                        className="text-lg font-semibold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={`title-${index}-${currentFeature}`}
                      className="text-xl md:text-2xl font-semibold"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: index === currentFeature ? 1 : 0.7,
                      }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`content-${index}-${currentFeature}`}
                      className="text-sm md:text-lg text-muted-foreground mt-1"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: index === currentFeature ? 1 : 0.6,
                      }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {feature.content}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              "order-1 md:order-2 relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg border border-border/50"
            )}
          >
            {/* Background animated elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
              animate={{
                background: [
                  "linear-gradient(135deg, hsl(var(--primary) / 0.05), transparent, hsl(var(--primary) / 0.1))",
                  "linear-gradient(225deg, hsl(var(--primary) / 0.1), transparent, hsl(var(--primary) / 0.05))",
                  "linear-gradient(135deg, hsl(var(--primary) / 0.05), transparent, hsl(var(--primary) / 0.1))",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{
                        y: 100,
                        opacity: 0,
                        rotateX: -20,
                        scale: 0.9,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        scale: 1,
                      }}
                      exit={{
                        y: -100,
                        opacity: 0,
                        rotateX: 20,
                        scale: 0.9,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        scale: { duration: 0.4 },
                      }}
                    >
                      <motion.div
                        className="relative w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={feature.image}
                          alt={feature.title || `Feature ${index + 1}`}
                          className="w-full h-full object-cover transition-transform"
                          width={1000}
                          height={500}
                        />

                        {/* Animated overlay gradients */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Step indicator overlay */}
                      </motion.div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
