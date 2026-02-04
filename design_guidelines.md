# Blog Management Platform - Design Guidelines

## Design Approach
**Hybrid Reference System**: Combining Medium's content-first philosophy with Notion's clean management interface and Linear's modern dashboard aesthetics. This creates a professional CMS that prioritizes content while maintaining powerful management capabilities.

## Core Design Principles
1. **Content Primacy**: Blog posts and media are the stars; UI supports without overwhelming
2. **Clear Hierarchy**: Distinct separation between public-facing blog views and admin management
3. **Contextual Richness**: Every action area (editing, commenting, media) provides relevant tools without clutter
4. **Progressive Disclosure**: Advanced features available when needed, hidden when not

## Color Palette

**Light Mode:**
- Primary: 220 80% 45% (Deep professional blue)
- Surface: 0 0% 98% (Soft white backgrounds)
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 50%
- Accent: 160 60% 45% (Teal for engagement - likes, reactions)
- Success: 142 71% 45%
- Warning: 38 92% 50%

**Dark Mode:**
- Primary: 220 70% 60%
- Surface: 220 15% 12%
- Surface Elevated: 220 12% 16%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 65%
- Accent: 160 55% 55%

## Typography
**Font Stack:**
- Headings: 'Inter', -apple-system, sans-serif (Weights: 600-800)
- Body: 'Inter', -apple-system, sans-serif (Weights: 400-500)
- Blog Content: 'Georgia', 'Merriweather', serif for article body (improved readability)
- Monospace: 'Fira Code', monospace for code/metadata

**Scale:**
- Hero/Display: text-5xl to text-6xl (48-60px)
- H1: text-4xl (36px)
- H2: text-3xl (30px)
- H3: text-2xl (24px)
- Body Large: text-lg (18px)
- Body: text-base (16px)
- Small: text-sm (14px)
- Tiny: text-xs (12px)

## Layout System
**Spacing Units**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Micro spacing: 1-2 (4-8px)
- Component padding: 4-6 (16-24px)
- Section spacing: 8-12 (32-48px)
- Page margins: 16-24 (64-96px)

**Container Strategy:**
- Dashboard/Management: max-w-7xl for wide data displays
- Blog Content Reading: max-w-3xl for optimal readability (prose width)
- Media Upload Areas: max-w-5xl
- Sidebars: w-64 to w-80

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed position with backdrop blur (backdrop-blur-md)
- Height: h-16
- Contains: Logo, main nav links, user profile dropdown, notifications bell
- Search bar integrated for finding posts/comments
- Dark/light mode toggle

**Side Navigation (Dashboard):**
- Collapsible sidebar: w-64 expanded, w-16 collapsed
- Icons + text labels (hide text when collapsed)
- Sections: Dashboard, Posts, Media, Comments, Analytics, Settings
- Active state: subtle background fill + primary color border-left

### Blog Post Management

**Post Editor:**
- Full-screen distraction-free mode option
- Floating toolbar with rich text controls:
  - Font family dropdown (8-10 options including serif/sans-serif)
  - Font size: 12px to 72px slider + input
  - Bold, Italic, Underline, Strikethrough
  - Text color picker with saved palette
  - Highlight color picker
  - Alignment (left, center, right, justify)
  - Lists (ordered, unordered)
  - Insert media button (image/video)
- Live preview toggle
- Auto-save indicator with timestamp
- Character/word count display

**Post Card (List View):**
- Horizontal layout: Thumbnail (left) + Content (right)
- Thumbnail: 16:9 ratio, rounded-lg, 200px width
- Title (text-xl font-semibold), excerpt (text-sm), metadata row
- Action buttons overlay on hover: Edit, Delete, Share, View Stats
- Engagement metrics: views, likes, comments with icons

### Media Management

**Upload Areas:**
- Drag-and-drop zones with dashed border (border-dashed border-2)
- Large upload icon + "Drop files or click to browse"
- Accept formats displayed: Images (JPG, PNG, GIF) / Videos (MP4, MOV)
- Progress bars during upload with percentage
- Thumbnail grid after upload with remove buttons

**Media Library:**
- Masonry grid layout for images
- Video thumbnails with play icon overlay
- Filter tabs: All, Images, Videos
- Search and sort controls
- Bulk select mode with checkboxes

### Social & Engagement

**Comment Section:**
- Threaded comments (indent level: pl-8 per level, max 3 levels)
- User avatar (rounded-full w-10 h-10) + username + timestamp
- Inline reply button, like counter, report/delete options
- Comment moderation panel: Approve/Reject buttons for pending
- Real-time updates with subtle animation

**Reactions System:**
- Inline reaction bar below posts: Like ❤️, Celebrate 🎉, Insightful 💡, Fire 🔥
- Hover to see who reacted
- Count display next to each reaction type
- Active state: filled icon + primary color

**Share Panel:**
- Modal with share options: Twitter, Facebook, LinkedIn, Copy Link
- Platform-specific preview cards
- Share count tracker

### Account Management

**Profile Settings:**
- Two-column layout: Avatar upload (left) + Form fields (right)
- Avatar: Large circular preview (w-32 h-32), change photo button
- Fields: Username, Email, Bio (textarea), Website URL
- Social media links section (add multiple platforms)
- Privacy settings toggles
- Save/Cancel buttons (sticky at bottom on scroll)

**Authentication Pages:**
- Centered card design (max-w-md)
- Logo at top
- Clean form inputs with floating labels
- Primary CTA button (full width)
- Social login options (divider with "or continue with")
- Remember me checkbox, Forgot password link

## Visual Treatments

**Cards & Surfaces:**
- Border: border border-gray-200 dark:border-gray-800
- Shadow: shadow-sm to shadow-md (no heavy shadows)
- Hover: slight lift (hover:shadow-lg) + subtle border color change
- Radius: rounded-lg (8px) for cards, rounded-md for buttons

**Buttons:**
- Primary: bg-primary text-white, h-10 px-6, font-medium
- Secondary: bg-surface border border-gray-300, hover:bg-gray-50
- Destructive: bg-red-600 text-white
- Icon buttons: p-2 rounded-md hover:bg-gray-100
- Loading state: spinner + disabled appearance

**Form Inputs:**
- Height: h-11
- Border: border-2 focus:border-primary
- Padding: px-4
- Background: bg-surface in dark mode
- Labels: text-sm font-medium mb-2

**Badges & Tags:**
- Pill shape: rounded-full px-3 py-1 text-xs
- Status colors: Published (green), Draft (yellow), Scheduled (blue)
- Category tags: subtle bg with border

## Animations
Use sparingly, only for:
- Page transitions: Subtle fade (200ms)
- Dropdown menus: Slide + fade (150ms)
- Toast notifications: Slide in from top-right (300ms)
- Loading spinners: Smooth rotation
- Like/reaction: Quick scale bounce (200ms)

## Images

**Hero Image:**
- Yes, use a large hero image on the main blog landing page
- Dimensions: Full-width, 60vh height
- Content: Modern workspace with laptop, coffee, creative materials
- Overlay: Dark gradient overlay (from transparent to rgba(0,0,0,0.4))
- Text on overlay: "Your Stories, Beautifully Managed" + CTA button

**Profile Pictures:**
- Replace all placeholder avatars with user's provided image
- Circular crop, consistent sizing across all instances
- Fallback: Initials in colored circle if no image

**Blog Thumbnails:**
- 16:9 ratio consistently
- Placeholder: Abstract geometric patterns in brand colors
- Object-fit: cover to prevent distortion

**Empty States:**
- Illustrative icons (not photos) for: No posts yet, No comments, No media
- Call-to-action to create first item