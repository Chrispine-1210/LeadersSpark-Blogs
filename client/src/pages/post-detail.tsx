import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { PostWithAuthor, CommentWithAuthor } from "@shared/schema";
import { ArrowLeft, Heart, Share2, Edit, Eye, PartyPopper, Lightbulb, Flame, Bookmark, Users } from "lucide-react";
import { Link } from "wouter";
import { CommentSection } from "@/components/comment-section";
import { ShareDialog } from "@/components/share-dialog";
import { useState } from "react";
import profileImage from "@assets/FB_IMG_1760936852384_1760936861661.jpg";

const REACTION_TYPES = [
  { type: "celebrate", icon: PartyPopper, label: "Celebrate" },
  { type: "insightful", icon: Lightbulb, label: "Insightful" },
  { type: "fire", icon: Flame, label: "Fire" },
];

export default function PostDetail() {
  const [, params] = useRoute("/post/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shareOpen, setShareOpen] = useState(false);

  const { data: post, isLoading } = useQuery<PostWithAuthor>({
    queryKey: [user ? "/api/posts" : "/api/public/posts", params?.id],
    enabled: !!params?.id,
  });

  const { data: comments } = useQuery<CommentWithAuthor[]>({
    queryKey: [user ? "/api/posts" : "/api/public/posts", params?.id, "comments"],
    enabled: !!params?.id,
  });

  // Increment view count on mount
  useEffect(() => {
    if (params?.id) {
      apiRequest("POST", `/api/posts/${params.id}/view`, undefined).catch(() => {});
    }
  }, [params?.id]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (post?.userHasLiked) {
        await apiRequest("DELETE", `/api/posts/${params?.id}/like`, undefined);
      } else {
        await apiRequest("POST", `/api/posts/${params?.id}/like`, undefined);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user ? "/api/posts" : "/api/public/posts", params?.id] });
      queryClient.invalidateQueries({ queryKey: [user ? "/api/posts" : "/api/public/posts"] });
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
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const reactionMutation = useMutation({
    mutationFn: async (type: string) => {
      if (post?.userReaction === type) {
        await apiRequest("DELETE", `/api/posts/${params?.id}/reaction`, undefined);
      } else {
        await apiRequest("POST", `/api/posts/${params?.id}/reaction`, { type });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user ? "/api/posts" : "/api/public/posts", params?.id] });
      queryClient.invalidateQueries({ queryKey: [user ? "/api/posts" : "/api/public/posts"] });
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
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: subscription } = useQuery<{ isSubscribed: boolean; count: number }>({
    queryKey: ["/api/authors", post?.userId, "subscription"],
    enabled: !!post?.userId && !!user,
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (subscription?.isSubscribed) {
        await apiRequest("DELETE", `/api/authors/${post?.userId}/subscribe`, undefined);
      } else {
        await apiRequest("POST", `/api/authors/${post?.userId}/subscribe`, undefined);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/authors", post?.userId, "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: subscription?.isSubscribed ? "Unsubscribed" : "Subscribed",
        description: subscription?.isSubscribed ? "You've unsubscribed from this author." : "You'll now receive updates from this author.",
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (post?.userHasBookmarked) {
        await apiRequest("DELETE", `/api/posts/${params?.id}/bookmark`, undefined);
      } else {
        await apiRequest("POST", `/api/posts/${params?.id}/bookmark`, undefined);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [isAuthenticated ? "/api/posts" : "/api/public/posts", params?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: post?.userHasBookmarked ? "Removed Bookmark" : "Saved to Bookmarks",
        description: post?.userHasBookmarked ? "Post removed from your saved list." : "Post saved to your profile.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in to save posts.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist</p>
        <Button asChild>
          <Link href={isAuthenticated ? "/posts" : "/feed"}>
            {isAuthenticated ? "Back to Posts" : "Back to Feed"}
          </Link>
        </Button>
      </div>
    );
  }

  const getInitials = () => {
    if (post.author.firstName && post.author.lastName) {
      return `${post.author.firstName[0]}${post.author.lastName[0]}`.toUpperCase();
    }
    return post.author.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild data-testid="button-back">
        <Link href={user ? "/posts" : "/feed"}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {user ? "Back to Posts" : "Back to Feed"}
        </Link>
      </Button>

      {/* Post Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant={post.published ? "default" : "secondary"}>
            {post.published ? "Published" : "Draft"}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount} views
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="post-title">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={post.author.profileImageUrl || profileImage} 
                alt={post.author.firstName || "Author"} 
                className="object-cover"
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium" data-testid="author-name">
                {post.author.brandName || (post.author.firstName && post.author.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author.email)}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {user && post.author.id !== (user as any)?.id && (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => subscribeMutation.mutate()}
                      className={`font-semibold hover:underline ${subscription?.isSubscribed ? "text-muted-foreground" : "text-primary"}`}
                    >
                      {subscription?.isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {user && (
            <Button variant="outline" asChild data-testid="button-edit-post">
              <Link href={`/edit/${post.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          data-testid="post-cover-image"
        />
      )}

      {/* Video */}
      {post.videoUrl && (
        <video
          src={post.videoUrl}
          controls
          className="w-full h-auto rounded-lg"
          data-testid="post-video"
        />
      )}

      {/* Content */}
      <Card>
        <CardContent className="p-8">
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            style={{
              fontFamily: post.fontFamily || "Georgia",
              fontSize: post.fontSize || "18px",
              color: post.textColor,
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-testid="post-content"
          />
        </CardContent>
      </Card>

      {/* Engagement Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Like Button */}
            <Button
              variant={post.userHasLiked ? "default" : "outline"}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              data-testid="button-like"
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${post.userHasLiked ? "fill-current" : ""}`} />
              {post._count?.likes || 0}
            </Button>

            {/* Reaction Buttons */}
            {REACTION_TYPES.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={post.userReaction === type ? "default" : "outline"}
                onClick={() => reactionMutation.mutate(type)}
                disabled={reactionMutation.isPending}
                data-testid={`button-reaction-${type}`}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}

            {/* Bookmark Button */}
            <Button
              variant={post.userHasBookmarked ? "default" : "outline"}
              onClick={() => bookmarkMutation.mutate()}
              disabled={bookmarkMutation.isPending}
              data-testid="button-bookmark"
              className="gap-2"
            >
              <Bookmark className={`h-4 w-4 ${post.userHasBookmarked ? "fill-current" : ""}`} />
              {post.userHasBookmarked ? "Saved" : "Save"}
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              onClick={() => setShareOpen(true)}
              data-testid="button-share"
              className="gap-2 ml-auto"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection postId={post.id} comments={comments || []} />

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        postUrl={`${window.location.origin}/post/${post.id}`}
        postTitle={post.title}
      />
    </div>
  );
}
