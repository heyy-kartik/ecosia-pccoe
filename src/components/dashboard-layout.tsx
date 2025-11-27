"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconHome,
  IconBook,
  IconTrendingUp,
  IconSettings,
  IconUser,
  IconMenu2,
  IconBell,
  IconSearch,
  IconLogout,
  IconChevronDown,
  IconLeaf,
  IconCalendar,
  IconTarget,
  IconAward,
  IconQuestionMark,
  IconBrain,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconHome,
    badge: null,
  },
  {
    title: "Content",
    href: "/content",
    icon: IconBook,
    badge: "New",
  },
  {
    title: "Progress",
    href: "/progress",
    icon: IconTrendingUp,
    badge: null,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: IconCalendar,
    badge: null,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: IconTarget,
    badge: null,
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: IconAward,
    badge: null,
  },
  {
    title: "Quiz",
    href: "/quiz",
    icon: IconBrain,
    badge: "3",
  },
  {
    title: "Onboarding",
    href: "/onboarding",
    icon: IconQuestionMark,
    badge: null,
  },
];

const bottomNavigationItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: IconSettings,
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <IconSun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <IconMoon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IconDeviceDesktop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
          <IconLeaf className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">ECOSIA</h1>
          <p className="text-xs text-muted-foreground">Climate Education</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t">
        <nav className="space-y-1">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function Header() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Mobile Menu */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconMenu2 className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Navigate through your dashboard
                </SheetDescription>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search lessons, topics..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <IconBell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium">
                      {user?.firstName?.charAt(0) ||
                        user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <p className="text-sm font-medium">
                        {user?.firstName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <IconChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-muted/50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-80">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
