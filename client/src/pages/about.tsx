import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Rocket, Globe, Users } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">BlogHub</Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild><Link href="/feed">Explore Feed</Link></Button>
            <Button onClick={() => window.location.href = "/api/login"}>Register Brand</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Publish Your Story with BlogHub</h1>
          <p className="text-xl text-muted-foreground">The most powerful platform for brands and creators to reach their audience.</p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover-elevate">
            <CardHeader>
              <Rocket className="h-10 w-10 text-primary mb-2" />
              <CardTitle>For Brands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Establish your digital presence with professional tools tailored for growth.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Custom branding & styles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Multi-media support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Users className="h-10 w-10 text-accent mb-2" />
              <CardTitle>For Readers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Discover stories that matter to you. Engage with creators and join the conversation.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Save & track posts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Personalized feed</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Active community</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-8 bg-accent/5 p-8 rounded-2xl border border-accent/20">
          <h2 className="text-3xl font-bold text-center">How to Get Started</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">1</div>
              <h3 className="font-bold">Register</h3>
              <p className="text-sm text-muted-foreground">Create an account using Replit Auth in seconds.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">2</div>
              <h3 className="font-bold">Create</h3>
              <p className="text-sm text-muted-foreground">Use our rich text editor to draft your masterpiece.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">3</div>
              <h3 className="font-bold">Publish</h3>
              <p className="text-sm text-muted-foreground">Reach thousands of readers instantly across the globe.</p>
            </div>
          </div>
          <div className="text-center pt-8">
            <Button size="lg" onClick={() => window.location.href = "/api/login"} className="px-12">Register Now</Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; 2025 BlogHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}