import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            Ecosia PCCOE
          </Link>
          <SignedIn>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/content">
                <Button variant="ghost">Content</Button>
              </Link>
            </div>
          </SignedIn>
        </div>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
