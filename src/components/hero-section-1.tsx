"use client";
import React from "react";
import Link from "next/link";

import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Movingquotes from "@/components/Movingquotes";
import dynamic from "next/dynamic";
import {motion,Variants} from "framer-motion";
const ModeToggle = dynamic(
  () => import("@/components/toggle-dark").then((mod) => mod.ModeToggle),
  { ssr: false }
);
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
// ...existing code...

const variants: Variants = {
  hidden: { opacity: 0, filter: "none", y: 20 },
  visible: {
    opacity: 1,
    filter: "none",
    y: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.6 },
  },
};
// ...existing code...
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

//Helper component for small star ratings

export function HeroSection() {
  return (
    <>
      <>
        <HeroHeader />
        <main className="overflow-hidden">
          <div
            aria-hidden
            className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
          >
            <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
            <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
            <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          </div>
          <section>
            <div className="relative pt-24 md:pt-36">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        delayChildren: 1,
                      },
                    },
                  },
                  item: {
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        bounce: 0.3,
                        duration: 2,
                      },
                    },
                  },
                }}
                className="absolute inset-0 -z-20"
              >
                <Image
                      src="/logo.jpg"
                      alt="background logo"
                      className="absolute inset-0 -z-20 opacity-[0.05] object-contain mx-auto"
                      width={1800}
                      height={1800}
                    />
              </AnimatedGroup>
              <div
                aria-hidden
                className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
              />
              <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mx-auto">
                  <AnimatedGroup variants={transitionVariants}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <Link
                        href="/"
                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                      >
                        <span className="text-foreground text-sm">
                          🎉# 1 Introducing First AI Climate Literacy Platform
                        </span>
                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                          <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                            <span className="flex size-6">
                              <ArrowRight className="m-auto size-3" />
                            </span>
                            <span className="flex size-6">
                              <ArrowRight className="m-auto size-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                    >
                      Climate Literacy Platform Powered by AI
                    </motion.h1>

                    <p className="mx-auto mt-8 max-w-2xl text-balance text-center align-middle text-lg text-muted-foreground">
                      Empower individuals with the knowledge and tools to
                      understand climate change, its impacts AI-personalized
                      content that adapts to each learner pace and interests.
                    </p>
                  </AnimatedGroup>

                  <AnimatedGroup
                    variants={{
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.75,
                          },
                        },
                      },
                      ...transitionVariants,
                    }}
                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row"
                  >
                    <div
                      key={1}
                      className="bg-foreground/10 rounded-[14px] ring-blue-400 p-0.5"
                    >
                      <Button
                        asChild
                        size="lg"
                        className="rounded-lg px-5 border border-gray-800 hover:text-gray-900 hover:scale-105 duration-200 transition-transform"
                      >
                        <Link href="/dashboard">
                          <span className="text-nowrap  hover:text-gray-900 dark:hover:text-gray-800 rounded-lg">
                            Get Started
                          </span>
                        </Link>
                      </Button>
                    </div>
                    <Button
                      key={2}
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-10.5 rounded-xl px-5"
                    >
                      <Link href="/dashboard">
                        <span className="text-nowrap rounded-lg">
                          Request a demo
                        </span>
                      </Link>
                    </Button>
                  </AnimatedGroup>
                </div>
              </div>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                  <div
                    aria-hidden
                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                  />
                  <div className="shadow-sm ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                    <Image
                      className="bg-background aspect-video relative hidden rounded-3xl shadow-2xl shadow-black/20 dark:block"
                      src="https://tailark.com//_next/image?url=%2Fmail2.png&w=3840&q=75"
                      alt="app screen"
                      width="2700"
                      height="1440"
                    />
                    <Image
                      className="z-2 border-border/25 aspect-video relative rounded-2xl border dark:hidden"
                      src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                      alt="app screen"
                      width="2700"
                      height="1440"
                    />
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </section>
          <section className="bg-background pb-16 pt-16 md:pb-32">
            <div className="group relative m-auto max-w-5xl px-6 ">
              <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                <Link
                  href="/"
                  className="block text-sm duration-150 hover:opacity-75"
                >
                  <ChevronRight className="ml-1 inline-block size-3" />
                </Link>
              </div>

              <div className="max-w-6xl mx-auto px-6 py-10 grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500  sm:gap-x-16 sm:gap-y-14">
                <Movingquotes />
              </div>
            </div>
          </section>
        </main>
      </>
    </>
  );
}

const menuItems = [
  { name: "Features", href: "features" },
  { name: "Solution", href: "solution" },

  { name: "Tutorials", href: "tutorials" },

  { name: "About", href: "about" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isDashboard = pathname.startsWith("/dashboard");
  const [fadeOpacity, setFadeOpacity] = React.useState(1);

  React.useEffect(() => {
    if (!isDashboard) return;

    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleFade = () => {
      const newOpacity = Math.max(1 - scrollContainer.scrollTop / 200, 0);
      setFadeOpacity(newOpacity);
    };

    scrollContainer.addEventListener("scroll", handleFade);
    return () => scrollContainer.removeEventListener("scroll", handleFade);
  }, [isDashboard]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 group"
        style={{ opacity: isDashboard ? fadeOpacity : 1 }}
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-6"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 py-3 lg:gap-6 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl  p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:space-y-0 lg:w-fit lg:flex-row lg:gap-6">
                <div className="flex justify-center items-center gap-3 p-2 sm:gap-4 lg:gap-5">
                  <SignedOut>
                    <Link href="/sign-in">
                      <button className="text-sm font-medium hover:text-accent-foreground transition-colors whitespace-nowrap">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="bg-[#000000] text-white font-sans rounded-lg font-medium text-sm px-4 py-2 hover:bg-gray-800 transition-colors whitespace-nowrap">
                        Sign Up
                      </button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <div>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                    >
                      <ModeToggle />
                    </ThemeProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/logo.jpg"
      alt="Company Logo"
      width={100}
      height={40}
      className={cn("h-6 w-10", className)}
    />
  );
};
