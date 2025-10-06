import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/hero-section-1";
export default function Home() {
  return (
    <div className="min-h-screen ">
      <HeroSection />

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Ecosia PCCOE. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
