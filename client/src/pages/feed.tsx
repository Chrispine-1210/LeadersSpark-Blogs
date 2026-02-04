import { useQuery } from "@tanstack/react-query";
import { PostWithAuthor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Eye } from "lucide-react";
import { format } from "date-fns";

export default function Feed() {
  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/public/posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">BlogHub</Link>
          <div className="flex gap-4">
            <Button variant="outline" asChild><Link href="/about">For Brands</Link></Button>
            <Button onClick={() => window.location.href = "/api/login"}>Sign In</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Public Feed</h1>
          <p className="text-muted-foreground">Latest stories from our community</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {posts?.map((post) => (
              <Card key={post.id} className="overflow-hidden hover-elevate transition-all border-none bg-card/40 shadow-sm">
                <div className="md:flex">
                  {post.coverImageUrl && (
                    <div className="md:w-1/3">
                      <img 
                        src={post.coverImageUrl} 
                        alt={post.title} 
                        className="h-48 md:h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 flex-1 ${post.coverImageUrl ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {post.author.profileImageUrl ? (
                          <img src={post.author.profileImageUrl} alt={post.author.firstName || ""} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold">
                            {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {post.author.brandName || (post.author.firstName && post.author.lastName
                          ? `${post.author.firstName} ${post.author.lastName}`
                          : post.author.email)}
                      </span>
                      <span className="text-sm text-muted-foreground">• {format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <Link href={`/read/${post.id}`}>
                      <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:text-primary transition-colors">{post.title}</h2>
                    </Link>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt || "No excerpt provided."}</p>
                    
                    <div className="flex items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-1"><Heart className="h-4 w-4" /> <span>{post._count?.likes || 0}</span></div>
                      <div className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> <span>{post._count?.comments || 0}</span></div>
                      <div className="flex items-center gap-1"><Eye className="h-4 w-4" /> <span>{post.viewCount || 0}</span></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}