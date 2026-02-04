import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import { MediaUpload } from "@/components/media-upload";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Post, InsertPost } from "@shared/schema";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link } from "wouter";

export default function CreatePost() {
  const [, params] = useRoute("/edit/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!params?.id;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const [published, setPublished] = useState(false);

  // Fetch existing post if editing
  const { data: existingPost } = useQuery<Post>({
    queryKey: ["/api/posts", params?.id],
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content);
      setCoverImageUrl(existingPost.coverImageUrl || "");
      setVideoUrl(existingPost.videoUrl || "");
      setFontFamily(existingPost.fontFamily || "Inter");
      setFontSize(existingPost.fontSize || "16px");
      setTextColor(existingPost.textColor || "");
      setHighlightColor(existingPost.highlightColor || "");
      setPublished(existingPost.published);
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      if (isEditing) {
        return await apiRequest("PATCH", `/api/posts/${params.id}`, data);
      } else {
        return await apiRequest("POST", "/api/posts", data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: published ? "Your post is now published" : "Your post has been saved as a draft",
      });
      navigate(`/post/${data.id}`);
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
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (publishNow?: boolean) => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      title,
      excerpt,
      content,
      coverImageUrl,
      videoUrl,
      fontFamily,
      fontSize,
      textColor,
      highlightColor,
      published: publishNow !== undefined ? publishNow : published,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href="/posts">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditing ? "Edit Post" : "Create New Post"}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Update your blog post" : "Write and publish your story"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saveMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saveMutation.isPending}
            data-testid="button-publish"
          >
            <Eye className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Add title and excerpt for your post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="mt-2"
              data-testid="input-title"
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary of your post..."
              className="mt-2 resize-none"
              rows={3}
              data-testid="input-excerpt"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="published">Publish Status</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {published ? "Post will be visible to everyone" : "Post will be saved as draft"}
              </p>
            </div>
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
              data-testid="switch-published"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Add cover image or video to your post</CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUpload
            onImageUpload={setCoverImageUrl}
            onVideoUpload={setVideoUrl}
            currentImage={coverImageUrl}
            currentVideo={videoUrl}
          />
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Write your blog post with rich formatting</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={content}
            onChange={setContent}
            fontFamily={fontFamily}
            fontSize={fontSize}
            textColor={textColor}
            highlightColor={highlightColor}
            onFontFamilyChange={setFontFamily}
            onFontSizeChange={setFontSize}
            onTextColorChange={setTextColor}
            onHighlightColorChange={setHighlightColor}
          />
        </CardContent>
      </Card>
    </div>
  );
}
