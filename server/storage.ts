import {
  users,
  posts,
  comments,
  likes,
  reactions,
  bookmarks,
  subscribers,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type Reaction,
  type Bookmark,
  type PostWithAuthor,
  type CommentWithAuthor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;

  // Post operations
  getPosts(userId?: string): Promise<PostWithAuthor[]>;
  getPostById(id: string, userId?: string): Promise<PostWithAuthor | undefined>;
  createPost(userId: string, post: InsertPost): Promise<Post>;
  updatePost(id: string, userId: string, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string, userId: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;

  // Comment operations
  getCommentsByPost(postId: string): Promise<CommentWithAuthor[]>;
  getAllComments(userId: string): Promise<any[]>;
  createComment(userId: string, comment: InsertComment): Promise<Comment>;
  deleteComment(id: string, userId: string): Promise<void>;

  // Like operations
  likePost(postId: string, userId: string): Promise<Like>;
  unlikePost(postId: string, userId: string): Promise<void>;
  hasUserLikedPost(postId: string, userId: string): Promise<boolean>;

  // Reaction operations
  addReaction(postId: string, userId: string, type: string): Promise<Reaction>;
  removeReaction(postId: string, userId: string): Promise<void>;
  getUserReaction(postId: string, userId: string): Promise<string | null>;

  // Bookmark operations
  bookmarkPost(postId: string, userId: string): Promise<Bookmark>;
  unbookmarkPost(postId: string, userId: string): Promise<void>;
  hasUserBookmarkedPost(postId: string, userId: string): Promise<boolean>;
  getUserBookmarks(userId: string): Promise<PostWithAuthor[]>;

  // Subscription operations
  subscribe(authorId: string, subscriberId: string): Promise<void>;
  unsubscribe(authorId: string, subscriberId: string): Promise<void>;
  isSubscribed(authorId: string, subscriberId: string): Promise<boolean>;
  getSubscriberCount(authorId: string): Promise<number>;

  // Stats operations
  getUserStats(userId: string): Promise<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalViews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Post operations
  async getPosts(userId?: string): Promise<PostWithAuthor[]> {
    const query = userId
      ? db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt))
      : db.select().from(posts).orderBy(desc(posts.createdAt));

    const allPosts = await query;

    const postsWithAuthors = await Promise.all(
      allPosts.map(async (post) => {
        const [author] = await db.select().from(users).where(eq(users.id, post.userId));
        
        const [likesCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(likes)
          .where(eq(likes.postId, post.id));
        
        const [commentsCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(comments)
          .where(eq(comments.postId, post.id));

        const [reactionsCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(reactions)
          .where(eq(reactions.postId, post.id));

        return {
          ...post,
          author,
          _count: {
            likes: likesCount?.count || 0,
            comments: commentsCount?.count || 0,
            reactions: reactionsCount?.count || 0,
          },
        } as PostWithAuthor;
      })
    );

    return postsWithAuthors;
  }

  async getPostById(id: string, userId?: string): Promise<PostWithAuthor | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) return undefined;

    const [author] = await db.select().from(users).where(eq(users.id, post.userId));
    
    const [likesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(likes)
      .where(eq(likes.postId, post.id));
    
    const [commentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(comments)
      .where(eq(comments.postId, post.id));

    const [reactionsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reactions)
      .where(eq(reactions.postId, post.id));

    let userHasLiked = false;
    let userHasBookmarked = false;
    let userReaction: string | null = null;

    if (userId) {
      const [like] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, id), eq(likes.userId, userId)));
      userHasLiked = !!like;

      const [bookmark] = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.postId, id), eq(bookmarks.userId, userId)));
      userHasBookmarked = !!bookmark;

      const [reaction] = await db
        .select()
        .from(reactions)
        .where(and(eq(reactions.postId, id), eq(reactions.userId, userId)));
      userReaction = reaction?.type || null;
    }

    return {
      ...post,
      author,
      _count: {
        likes: likesCount?.count || 0,
        comments: commentsCount?.count || 0,
        reactions: reactionsCount?.count || 0,
      },
      userHasLiked,
      userHasBookmarked,
      userReaction,
    } as PostWithAuthor;
  }

  async createPost(userId: string, postData: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values({ ...postData, userId })
      .returning();
    return post;
  }

  async updatePost(id: string, userId: string, postData: Partial<InsertPost>): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ ...postData, updatedAt: new Date() })
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .returning();
    return post;
  }

  async deletePost(id: string, userId: string): Promise<void> {
    await db.delete(posts).where(and(eq(posts.id, id), eq(posts.userId, userId)));
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, id));
  }

  // Comment operations
  async getCommentsByPost(postId: string): Promise<CommentWithAuthor[]> {
    const allComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    const commentsWithAuthors = await Promise.all(
      allComments.map(async (comment) => {
        const [author] = await db.select().from(users).where(eq(users.id, comment.userId));
        return { ...comment, author } as CommentWithAuthor;
      })
    );

    // Build threaded structure
    const commentMap = new Map<string, CommentWithAuthor & { replies: CommentWithAuthor[] }>();
    const topLevel: (CommentWithAuthor & { replies: CommentWithAuthor[] })[] = [];

    commentsWithAuthors.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    commentsWithAuthors.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        topLevel.push(commentWithReplies);
      }
    });

    return topLevel;
  }

  async getAllComments(userId: string): Promise<any[]> {
    const userPosts = await db.select().from(posts).where(eq(posts.userId, userId));
    const postIds = userPosts.map(p => p.id);

    if (postIds.length === 0) return [];

    const allComments = await db
      .select()
      .from(comments)
      .where(sql`${comments.postId} = ANY(${postIds})`)
      .orderBy(desc(comments.createdAt));

    const commentsWithDetails = await Promise.all(
      allComments.map(async (comment) => {
        const [author] = await db.select().from(users).where(eq(users.id, comment.userId));
        const [post] = await db.select().from(posts).where(eq(posts.id, comment.postId));
        const [postAuthor] = await db.select().from(users).where(eq(users.id, post.userId));
        
        return {
          ...comment,
          author,
          post: { ...post, author: postAuthor },
        };
      })
    );

    return commentsWithDetails;
  }

  async createComment(userId: string, commentData: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values({ ...commentData, userId })
      .returning();
    return comment;
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    await db.delete(comments).where(and(eq(comments.id, id), eq(comments.userId, userId)));
  }

  // Like operations
  async likePost(postId: string, userId: string): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values({ postId, userId })
      .returning();
    return like;
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  }

  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    return !!like;
  }

  // Reaction operations
  async addReaction(postId: string, userId: string, type: string): Promise<Reaction> {
    // Remove existing reaction if any
    await db.delete(reactions).where(and(eq(reactions.postId, postId), eq(reactions.userId, userId)));
    
    const [reaction] = await db
      .insert(reactions)
      .values({ postId, userId, type })
      .returning();
    return reaction;
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    await db.delete(reactions).where(and(eq(reactions.postId, postId), eq(reactions.userId, userId)));
  }

  async getUserReaction(postId: string, userId: string): Promise<string | null> {
    const [reaction] = await db
      .select()
      .from(reactions)
      .where(and(eq(reactions.postId, postId), eq(reactions.userId, userId)));
    return reaction?.type || null;
  }

  // Bookmark operations
  async bookmarkPost(postId: string, userId: string): Promise<Bookmark> {
    const [bookmark] = await db
      .insert(bookmarks)
      .values({ postId, userId })
      .returning();
    return bookmark;
  }

  async unbookmarkPost(postId: string, userId: string): Promise<void> {
    await db.delete(bookmarks).where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));
  }

  async hasUserBookmarkedPost(postId: string, userId: string): Promise<boolean> {
    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));
    return !!bookmark;
  }

  async getUserBookmarks(userId: string): Promise<PostWithAuthor[]> {
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));
    
    const postIds = userBookmarks.map(b => b.postId);
    if (postIds.length === 0) return [];

    const bookmarkedPosts = await db
      .select()
      .from(posts)
      .where(sql`${posts.id} = ANY(${postIds})`);

    return Promise.all(
      bookmarkedPosts.map(async (post) => {
        const [author] = await db.select().from(users).where(eq(users.id, post.userId));
        
        const [likesCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(likes)
          .where(eq(likes.postId, post.id));
        
        const [commentsCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(comments)
          .where(eq(comments.postId, post.id));

        const [reactionsCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(reactions)
          .where(eq(reactions.postId, post.id));

        return {
          ...post,
          author,
          userHasBookmarked: true,
          _count: {
            likes: likesCount?.count || 0,
            comments: commentsCount?.count || 0,
            reactions: reactionsCount?.count || 0,
          },
        } as PostWithAuthor;
      })
    );
  }

  // Subscription operations
  async subscribe(authorId: string, subscriberId: string): Promise<void> {
    await db.insert(subscribers).values({ authorId, subscriberId }).onConflictDoNothing();
  }

  async unsubscribe(authorId: string, subscriberId: string): Promise<void> {
    await db.delete(subscribers).where(and(eq(subscribers.authorId, authorId), eq(subscribers.subscriberId, subscriberId)));
  }

  async isSubscribed(authorId: string, subscriberId: string): Promise<boolean> {
    const [sub] = await db.select().from(subscribers).where(and(eq(subscribers.authorId, authorId), eq(subscribers.subscriberId, subscriberId)));
    return !!sub;
  }

  async getSubscriberCount(authorId: string): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers).where(eq(subscribers.authorId, authorId));
    return result?.count || 0;
  }

  // Stats operations
  async getUserStats(userId: string): Promise<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalViews: number;
    totalSubscribers: number;
  }> {
    const [postsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.userId, userId));

    const userPosts = await db.select().from(posts).where(eq(posts.userId, userId));
    const postIds = userPosts.map(p => p.id);

    let commentsCount = { count: 0 };
    let likesCount = { count: 0 };
    let totalViews = 0;

    if (postIds.length > 0) {
      [commentsCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(comments)
        .where(sql`${comments.postId} = ANY(${postIds.length > 0 ? postIds : ['']})`);

      [likesCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(likes)
        .where(sql`${likes.postId} = ANY(${postIds.length > 0 ? postIds : ['']})`);

      totalViews = userPosts.reduce((sum, post) => sum + post.viewCount, 0);
    }

    const [subscribersCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(subscribers)
      .where(eq(subscribers.authorId, userId));

    return {
      totalPosts: postsCount?.count || 0,
      totalComments: commentsCount?.count || 0,
      totalLikes: likesCount?.count || 0,
      totalViews,
      totalSubscribers: subscribersCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
