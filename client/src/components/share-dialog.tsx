import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SiX, SiFacebook, SiLinkedin } from "react-icons/si";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postUrl: string;
  postTitle: string;
}

export function ShareDialog({ open, onOpenChange, postUrl, postTitle }: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Post link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-share">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>Share this post on social media or copy the link</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={shareOnX}
              data-testid="button-share-twitter"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <SiX className="h-6 w-6" />
              <span className="text-xs">X (Twitter)</span>
            </Button>
            <Button
              variant="outline"
              onClick={shareOnFacebook}
              data-testid="button-share-facebook"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <SiFacebook className="h-6 w-6" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              onClick={shareOnLinkedIn}
              data-testid="button-share-linkedin"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <SiLinkedin className="h-6 w-6" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Link</label>
            <div className="flex gap-2">
              <Input
                value={postUrl}
                readOnly
                data-testid="input-post-url"
                className="flex-1"
              />
              <Button
                onClick={handleCopyLink}
                data-testid="button-copy-link"
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
