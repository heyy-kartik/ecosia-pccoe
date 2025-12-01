"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TypeScript interfaces for the component props
interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  customActions?: React.ReactNode;
  onMobileMenuToggle?: () => void;
}

// User data interface
interface UserData {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  ageGroup?: "child" | "teen" | "adult";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DashboardHeader - Sticky header component for the dashboard
 *
 * Features:
 * - Sticky positioning at top of content area
 * - Search bar functionality with proper input styling
 * - User profile dropdown with theme toggle and user actions
 * - Mobile sidebar trigger button for responsive behavior
 *
 * Requirements addressed:
 * - 1.4: Mobile sidebar trigger for responsive behavior
 * - 2.4: Sticky header at top of content area
 * - 3.2: Consistent spacing, typography, and visual hierarchy
 */
export const DashboardHeader = React.memo(function DashboardHeader({
  title,
  showSearch = true,
  customActions,
  onMobileMenuToggle,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);

  // Fetch user data from database
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!isSignedIn) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.warn(
            "Failed to fetch user data from database, using Clerk data only"
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Continue with Clerk data only
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (isLoaded) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented based on requirements
    console.log("Search query:", searchQuery);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
  };

  const handleProfile = () => {
    router.push("/dashboard/profile");
  };

  // Get display name and email
  const getDisplayName = () => {
    if (userData?.firstName || userData?.lastName) {
      return `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
    }
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user?.emailAddresses?.[0]?.emailAddress?.split("@")?.[0] || "User";
  };

  const getDisplayEmail = () => {
    return userData?.email || user?.emailAddresses?.[0]?.emailAddress || "";
  };

  const getInitials = () => {
    const name = getDisplayName();
    if (name === "User") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isLoaded) {
    return (
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section: Mobile Menu + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          {onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </Button>
          )}

          {/* Page Title */}
          {title && (
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          )}
        </div>

        {/* Center Section: Search Bar */}
        {showSearch && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                placeholder="Search lessons, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-md border border-b bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </form>
        )}

        {/* Right Section: Actions + User Menu */}
        <div className="flex items-center gap-2">
          {/* Custom Actions */}
          {customActions}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun
              size={18}
              className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              size={18}
              className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.imageUrl || "/avatar-placeholder.png"}
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    {isLoadingUser ? "..." : getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {isLoadingUser ? "Loading..." : getDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isLoadingUser ? "" : getDisplayEmail()}
                  </p>
                  {userData?.ageGroup && (
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {userData.ageGroup} •{" "}
                      {userData.age ? `Age ${userData.age}` : ""}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut size={16} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});

export default DashboardHeader;
