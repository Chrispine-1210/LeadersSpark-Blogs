import { useQuery } from "@tanstack/react-query";
import { User, PostWithAuthor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Bookmark, Settings, FileText, Heart, MessageSquare } from "lucide-react";
import profileImage from "@assets/FB_IMG_1760936852384_1760936861661.jpg";

export default function ReaderProfile() {
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: bookmarkedPosts, isLoading: isLoadingBookmarks } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/bookmarks"],
  });

  if (isLoadingUser) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` || "U";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card className="border-none bg-card/40 backdrop-blur shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              <AvatarImage src={user?.profileImageUrl || profileImage} className="object-cover" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {user?.bio || "No bio yet. Tell the community about yourself!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Saved Stories</h2>
          </div>
          
          {isLoadingBookmarks ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
          ) : bookmarkedPosts?.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent text-center p-12">
              <p className="text-muted-foreground mb-4">You haven't saved any stories yet.</p>
              <Button asChild>
                <Link href="/feed">Explore Feed</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {bookmarkedPosts?.map((post) => (
                <Card key={post.id} className="hover-elevate transition-all overflow-hidden border-none bg-card/40 shadow-sm group">
                  {post.coverImageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img src={post.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author.profileImageUrl || profileImage} />
                        <AvatarFallback>{post.author.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{post.author.firstName}</span>
                    </div>
                    <Link href={`/read/${post.id}`}>
                      <h3 className="font-bold text-lg mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post._count?.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post._count?.comments}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}