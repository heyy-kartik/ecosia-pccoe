import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="relative z-20 w-full bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="">
                  <Image src="/logo.jpg" alt="Logo" width={40} height={50} />
                </div>
                <div className="font-bold text-foreground text-lg">
                  ECOSIA PCCOE
                </div>
                <div className="text-xs text-muted-foreground">
                  Climate Education — Powered by AI
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering individuals with the knowledge and tools to understand
              climate change through AI-personalized educational content.
            </p>
            <div className="text-sm text-muted-foreground">
              Made with <span className="text-green-500">🌱</span> for a
              sustainable future
            </div>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="font-bold text-foreground mb-3">Learning Paths</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/content?category=basics"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Climate Basics
                </Link>
              </li>
              <li>
                <Link
                  href="/content?category=science"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Climate Science
                </Link>
              </li>
              <li>
                <Link
                  href="/content?category=solutions"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Climate Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/content?category=action"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Climate Action
                </Link>
              </li>
              <li>
                <Link
                  href="/content?category=policy"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Climate Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Age Groups</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/content?ageGroup=children"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Children (6-12)
                </Link>
              </li>
              <li>
                <Link
                  href="/content?ageGroup=teens"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Teens (13-17)
                </Link>
              </li>
              <li>
                <Link
                  href="/content?ageGroup=adults"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Adults (18+)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent-foreground transition-colors"
                >
                  About ECOSIA
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-accent-foreground transition-colors"
                >
                  How AI Works
                </Link>
              </li>
              <li>
                <Link
                  href="/content"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Browse Content
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-accent-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="hover:text-accent-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-accent-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="hover:text-accent-foreground transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-accent-foreground transition-colors"
            >
              Accessibility
            </Link>
          </div>
          <div className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} ECOSIA PCCOE. Building climate literacy
            for all.
          </div>
        </div>
      </div>
    </footer>
  );
}
