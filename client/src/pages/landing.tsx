import { Button } from "@/components/ui/button";
import { FileText, Edit3, Share2, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">BlogHub</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/feed" className="text-sm font-medium hover:text-primary transition-colors">Feed</Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">Publishing</Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 max-w-5xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Your Stories,{" "}
              <span className="text-primary">Beautifully Managed</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create stunning blog posts with rich text editing, video uploads, and powerful social engagement features. The complete platform for managing your content.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-get-started"
                className="text-lg h-12 px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-12 px-8"
                data-testid="button-learn-more"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              <div className="p-6 rounded-lg border border-border bg-card hover-elevate">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Edit3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rich Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced text editing with custom fonts, styles, and colors
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card hover-elevate">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Media Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images and videos to create engaging stories
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card hover-elevate">
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Social Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Share your posts across social media platforms
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card hover-elevate">
                <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Comments, likes, and reactions on all your posts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 BlogHub. Built with passion for content creators.</p>
        </div>
      </footer>
    </div>
  );
}
