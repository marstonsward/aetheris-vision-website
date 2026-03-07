import { describe, it, expect } from "vitest";
import { posts, getPostBySlug, getPrevNextPosts, getCategories } from "@/lib/posts";

describe("posts data", () => {
  it("exports a non-empty posts array", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("each post has required fields", () => {
    for (const post of posts) {
      expect(post.id).toBeTypeOf("number");
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.summary).toBeTruthy();
      expect(post.readTime).toBeTruthy();
      expect(post.content).toBeTruthy();
      expect(post.author).toBeDefined();
      expect(post.author.name).toBeTruthy();
      expect(post.author.initials).toBeTruthy();
    }
  });

  it("slugs are unique", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("slugs are URL-safe", () => {
    for (const post of posts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("IDs are unique", () => {
    const ids = posts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getPostBySlug", () => {
  it("returns the correct post for a valid slug", () => {
    const first = posts[0];
    const found = getPostBySlug(first.slug);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });

  it("returns undefined for an invalid slug", () => {
    expect(getPostBySlug("nonexistent-post-slug-xyz")).toBeUndefined();
  });
});

describe("getPrevNextPosts", () => {
  it("returns null prev for the first post", () => {
    const { prev, next } = getPrevNextPosts(posts[0].slug);
    expect(prev).toBeNull();
    if (posts.length > 1) {
      expect(next).not.toBeNull();
    }
  });

  it("returns null next for the last post", () => {
    const last = posts[posts.length - 1];
    const { next } = getPrevNextPosts(last.slug);
    expect(next).toBeNull();
  });

  it("returns both prev and next for a middle post", () => {
    if (posts.length >= 3) {
      const middle = posts[1];
      const { prev, next } = getPrevNextPosts(middle.slug);
      expect(prev).not.toBeNull();
      expect(next).not.toBeNull();
    }
  });
});

describe("getCategories", () => {
  it("returns a non-empty array of unique categories", () => {
    const cats = getCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("every category exists on at least one post", () => {
    const cats = getCategories();
    for (const cat of cats) {
      expect(posts.some((p) => p.category === cat)).toBe(true);
    }
  });
});
