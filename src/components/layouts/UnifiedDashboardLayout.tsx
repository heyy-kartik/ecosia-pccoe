"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// TypeScript interfaces for the component props
interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  showSearch?: boolean;
  customActions?: React.ReactNode;
}

/**
 * UnifiedDashboardLayout - A consistent layout component for all dashboard pages
 *
 * Features:
 * - Fixed sidebar navigation (280px width on desktop)
 * - Responsive mobile behavior with collapsible sidebar
 * - Single scrollable main content area
 * - Sticky header with search and user actions
 * - Proper overflow handling to prevent double scrollbars
 *
 * Requirements addressed:
 * - 1.1: Consistent sidebar navigation across all dashboard pages
 * - 2.1: Single scrollable area without multiple scrollbars
 * - 2.2: Fixed sidebar that remains visible during scroll
 * - 2.3: Sticky header at top of content area
 */
export function UnifiedDashboardLayout({
  children,
  pageTitle,
  showSearch = true,
  customActions,
}: DashboardLayoutProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated (this shouldn't happen due to middleware, but good fallback)
  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Authentication Required</p>
          <p className="text-muted-foreground">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Fixed Sidebar - Desktop (280px width) */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0">
        <DashboardSidebar />
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-[280px] overflow-hidden">
        {/* Dashboard Header */}
        <DashboardHeader
          title={pageTitle}
          showSearch={showSearch}
          customActions={customActions}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Main Content - Single Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <div className="px-4 py-6 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default UnifiedDashboardLayout;
