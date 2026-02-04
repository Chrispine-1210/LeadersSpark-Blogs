# BlogHub - Blog Management Platform

## Overview
BlogHub is a comprehensive blog management platform that allows users to create, edit, and manage blog posts with rich text editing, media uploads, and social engagement features.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with Wouter for routing
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: TanStack Query (React Query)
- **Authentication**: Replit Auth (OIDC)
- **Theme**: Dark/Light mode support

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Passport.js with Replit Auth
- **Session Storage**: PostgreSQL-backed sessions

## Key Features

### 1. User Authentication
- Secure authentication via Replit Auth
- Supports multiple login methods (Google, GitHub, email, etc.)
- Session management with PostgreSQL storage

### 2. Blog Post Management
- Create, read, update, delete (CRUD) operations
- Rich text editor with:
  - Font family selection (9 options)
  - Font size adjustment (12px - 72px)
  - Text formatting (bold, italic, underline)
  - Text alignment options
  - Text color picker
  - Highlight color picker
- Draft and publish workflows
- View count tracking

### 3. Media Upload
- Cover image upload for posts
- Video upload support
- Drag-and-drop interface
- Preview before publishing

### 4. Social Engagement
- Likes system
- Reactions (Celebrate, Insightful, Fire)
- Social media sharing (Twitter, Facebook, LinkedIn)
- Copy link functionality

### 5. Comments System
- Threaded comments (up to 3 levels)
- Real-time comment creation
- Comment deletion by author
- Reply functionality

### 6. User Profile
- Profile customization
- Bio and name editing
- Profile picture upload
- Custom profile image support

### 7. Dashboard & Analytics
- Post statistics (views, likes, comments)
- User activity overview
- Quick actions panel
- Recent posts display

## Database Schema

### Users
- Replit Auth integration
- Profile information (name, bio, avatar)
- Timestamps

### Posts
- Title, content, excerpt
- Cover image and video URLs
- Custom styling (font family, size, colors)
- Published/draft status
- View count

### Comments
- Threaded structure with parent-child relationships
- Associated with posts and users

### Likes
- User-post relationship
- Unique constraint per user-post pair

### Reactions
- Type-based reactions (celebrate, insightful, fire)
- User-post relationship

## Recent Changes (January 20, 2025)

### Initial Implementation
- Full-stack blog management platform built from scratch
- Replit Auth integration for secure authentication
- PostgreSQL database with Drizzle ORM
- Rich text editor with extensive customization
- Media upload system for images and videos
- Social engagement features (likes, reactions, comments)
- Responsive design with dark mode support
- Complete CRUD operations for all entities

## User Preferences
- Uses provided profile image (FB_IMG_1760936852384_1760936861661.jpg)
- Professional color scheme (blue primary, teal accents)
- Clean, modern design aesthetic
- Mobile-responsive layout

## Running the Project
The application runs on port 5000 with:
- Frontend: Vite dev server
- Backend: Express server
- Database: PostgreSQL (automatically configured via DATABASE_URL)

Command: `npm run dev`

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `SESSION_SECRET`: Session encryption key (auto-configured)
- `REPLIT_DOMAINS`: Domains for auth callbacks (auto-configured)
- `REPL_ID`: Replit application ID (auto-configured)
