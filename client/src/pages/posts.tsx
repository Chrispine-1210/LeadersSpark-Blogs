import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { PenSquare, Search, Eye, Heart, MessageSquare, Edit, Trash2 } from "lucide-react";
import type { PostWithAuthor } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Posts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest("DELETE", `/api/posts/${postId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
      });
      setDeletePostId(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const publishedPosts = filteredPosts.filter(p => p.published);
  const draftPosts = filteredPosts.filter(p => !p.published);

  const PostCard = ({ post }: { post: PostWithAuthor }) => (
    <Card className="hover-elevate active-elevate-2" data-testid={`post-card-${post.id}`}>
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {post.coverImageUrl && (
            <Link href={`/post/${post.id}`}>
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-32 w-48 object-cover rounded-lg flex-shrink-0"
              />
            </Link>
          )}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link href={`/post/${post.id}`} className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold hover:text-primary transition-colors truncate">
                  {post.title}
                </h3>
              </Link>
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 150)}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post._count?.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {post._count?.comments || 0}
              </span>
              <span className="ml-auto">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" asChild data-testid={`button-edit-${post.id}`}>
                <Link href={`/edit/${post.id}`}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeletePostId(post.id)}
                data-testid={`button-delete-${post.id}`}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/post/${post.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold">My Posts</h1>
          <p className="text-muted-foreground mt-1">Manage all your blog posts</p>
        </div>
        <Button asChild data-testid="button-create-new">
          <Link href="/create">
            <PenSquare className="h-4 w-4 mr-2" />
            Create New Post
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({filteredPosts.length})
          </TabsTrigger>
          <TabsTrigger value="published" data-testid="tab-published">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" data-testid="tab-drafts">
            Drafts ({draftPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-32 w-48 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <PenSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Create your first blog post to get started"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/create">Create Post</Link>
                </Button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {publishedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No published posts yet</p>
            </div>
          ) : (
            publishedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No draft posts</p>
            </div>
          ) : (
            draftPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && deleteMutation.mutate(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
