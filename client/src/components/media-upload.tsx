import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MediaUploadProps {
  onImageUpload?: (url: string) => void;
  onVideoUpload?: (url: string) => void;
  accept?: "image" | "video" | "both";
  currentImage?: string;
  currentVideo?: string;
}

export function MediaUpload({
  onImageUpload,
  onVideoUpload,
  accept = "both",
  currentImage,
  currentVideo,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(currentVideo || null);

  const acceptTypes = accept === "image" 
    ? "image/*" 
    : accept === "video" 
    ? "video/*" 
    : "image/*,video/*";

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file");
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isImage) {
        setImagePreview(result);
      } else if (isVideo) {
        setVideoPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = isImage ? '/api/upload/image' : '/api/upload/video';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update with server URL
      if (isImage) {
        onImageUpload?.(data.url);
      } else if (isVideo) {
        onVideoUpload?.(data.url);
      }

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 500);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
      setUploadProgress(null);
      // Clear preview on error
      if (isImage) {
        setImagePreview(null);
      } else {
        setVideoPreview(null);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageUpload?.("");
  };

  const removeVideo = () => {
    setVideoPreview(null);
    onVideoUpload?.("");
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!imagePreview && !videoPreview && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          `}
        >
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
            data-testid="input-media-upload"
          />
          <label
            htmlFor="media-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">Drop files or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                {accept === "image" && "Images (JPG, PNG, GIF)"}
                {accept === "video" && "Videos (MP4, MOV)"}
                {accept === "both" && "Images (JPG, PNG, GIF) or Videos (MP4, MOV)"}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
            data-testid="button-remove-image"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Cover Image</span>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {videoPreview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <video
            src={videoPreview}
            controls
            className="w-full h-auto"
            data-testid="video-preview"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeVideo}
            data-testid="button-remove-video"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Video Content</span>
          </div>
        </div>
      )}
    </div>
  );
}
