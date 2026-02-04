import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Save, Upload, Share2, Globe, Lock } from "lucide-react";
import profileImage from "@assets/FB_IMG_1760936852384_1760936861661.jpg";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setProfileImageUrl(user.profileImageUrl || profileImage);
      setBrandName(user.brandName || "");
      setSocialLinks(user.socialLinks || { twitter: "", github: "", linkedin: "", website: "" });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { 
      firstName: string; 
      lastName: string; 
      bio: string; 
      profileImageUrl: string;
      brandName: string;
      socialLinks: any;
    }) => {
      await apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    // ... rest of mutation stays same
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      firstName,
      lastName,
      bio,
      profileImageUrl,
      brandName,
      socialLinks,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and profile settings</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImageUrl} alt={firstName} className="object-cover" />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label>Profile Picture</Label>
              <p className="text-sm text-muted-foreground">
                Upload a new profile picture or use your provided image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-upload"
                data-testid="input-profile-image"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("profile-image-upload")?.click()}
                  data-testid="button-upload-image"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProfileImageUrl(profileImage)}
                  data-testid="button-use-default"
                >
                  Use Provided Image
                </Button>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                data-testid="input-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                data-testid="input-last-name"
              />
            </div>
          </div>

          {/* Brand Info */}
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name (Optional)</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Acme Media or Tech Explorer"
              data-testid="input-brand-name"
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed as your publishing brand.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted"
              data-testid="input-email"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
              data-testid="textarea-bio"
            />
            <p className="text-xs text-muted-foreground">
              Brief description about yourself (optional)
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Accounts & Accountability */}
      <Card>
        <CardHeader>
          <CardTitle>Accountability & Socials</CardTitle>
          <CardDescription>Manage your brand visibility and verified social links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Twitter/X URL</Label>
              <Input 
                value={socialLinks.twitter} 
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})} 
                placeholder="https://twitter.com/username" 
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input 
                value={socialLinks.linkedin} 
                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})} 
                placeholder="https://linkedin.com/in/username" 
              />
            </div>
            <div className="space-y-2">
              <Label>Personal Website</Label>
              <Input 
                value={socialLinks.website} 
                onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})} 
                placeholder="https://yourwebsite.com" 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
              Save Social Links
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/api/logout"}
            data-testid="button-logout-settings"
          >
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
