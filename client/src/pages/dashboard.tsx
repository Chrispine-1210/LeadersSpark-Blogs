import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Heart, TrendingUp, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { PostWithAuthor } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  const { data: stats } = useQuery<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalViews: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const publishedPosts = posts?.filter(p => p.published) || [];
  const draftPosts = posts?.filter(p => !p.published) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-posts">{stats?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedPosts.length} published, {draftPosts.length} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-views">{stats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-likes">{stats?.totalLikes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">From your readers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-subscribers">{(stats as any)?.totalSubscribers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active audience members</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Posts</CardTitle>
            <CardDescription>Your posts with the most engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts
                  .sort((a, b) => (b.viewCount + (b._count?.likes || 0) * 5) - (a.viewCount + (a._count?.likes || 0) * 5))
                  .slice(0, 3)
                  .map((post) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <Link href={`/read/${post.id}`} className="font-medium hover:text-primary truncate flex-1 mr-4">
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.viewCount}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post._count?.likes}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No data available yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reader Engagement</CardTitle>
            <CardDescription>Breakdown of how readers interact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subscribers</span>
                <span className="font-bold">{(stats as any)?.totalSubscribers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Comments per Post</span>
                <span className="font-bold">{stats?.totalPosts ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Likes per Post</span>
                <span className="font-bold">{stats?.totalPosts ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Views per Post</span>
                <span className="font-bold">{stats?.totalPosts ? (stats.totalViews / stats.totalPosts).toFixed(0) : 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with creating and managing your content</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button asChild data-testid="button-create-post">
            <Link href="/create">
              <FileText className="h-4 w-4 mr-2" />
              Create New Post
            </Link>
          </Button>
          <Button variant="outline" asChild data-testid="button-view-posts">
            <Link href="/posts">View All Posts</Link>
          </Button>
          <Button variant="outline" asChild data-testid="button-view-comments">
            <Link href="/comments">Manage Comments</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your latest blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-32 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className="flex gap-4 p-3 rounded-lg hover-elevate active-elevate-2 border border-transparent hover:border-border">
                    {post.coverImageUrl && (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-24 w-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {post.excerpt || post.content.substring(0, 150)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{post.published ? 'Published' : 'Draft'}</span>
                        <span>{post._count?.likes || 0} likes</span>
                        <span>{post._count?.comments || 0} comments</span>
                        <span>{post.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No posts yet. Create your first blog post!</p>
              <Button asChild data-testid="button-create-first-post">
                <Link href="/create">Create Post</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
