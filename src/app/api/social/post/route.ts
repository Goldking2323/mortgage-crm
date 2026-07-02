import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;
const FB_USER_TOKEN = process.env.FB_USER_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID;

async function getPageToken(): Promise<string> {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}?fields=access_token&access_token=${FB_USER_TOKEN}`
  );
  const data = await res.json();
  if (!data.access_token) throw new Error("Could not get page access token");
  return data.access_token;
}

async function getInstagramAccountId(pageToken: string): Promise<string | null> {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}?fields=instagram_business_account&access_token=${pageToken}`
  );
  const data = await res.json();
  return data.instagram_business_account?.id ?? null;
}

async function postToFacebook(caption: string, imageUrl: string, pageToken: string) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${FB_PAGE_ID}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, url: imageUrl, access_token: pageToken }),
  });
  return res.json();
}

async function postToInstagram(caption: string, imageUrl: string, igId: string, pageToken: string) {
  // Step 1: Create media container
  const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: pageToken }),
  });
  const container = await containerRes.json();
  if (!container.id) throw new Error("Failed to create IG media container");

  // Step 2: Publish container
  const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: container.id, access_token: pageToken }),
  });
  return publishRes.json();
}

export async function POST(req: NextRequest) {
  // Verify cron secret so only authorized callers can trigger this
  const secret = req.headers.get("x-cron-secret");
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!FB_USER_TOKEN || !FB_PAGE_ID) {
    return NextResponse.json({ error: "Meta credentials not configured" }, { status: 500 });
  }

  // Pick the next post in rotation (oldest lastPostedAt, or never posted)
  const post = await prisma.socialPost.findFirst({
    where: { active: true },
    orderBy: [{ lastPostedAt: "asc" }, { order: "asc" }],
  });

  if (!post) {
    return NextResponse.json({ message: "No active posts to publish" });
  }

  try {
    const pageToken = await getPageToken();
    const igId = await getInstagramAccountId(pageToken);

    const results: Record<string, unknown> = {};

    // Post to Facebook
    results.facebook = await postToFacebook(post.caption, post.imageUrl, pageToken);

    // Post to Instagram if connected
    if (igId) {
      results.instagram = await postToInstagram(post.caption, post.imageUrl, igId, pageToken);
    }

    // Mark post as published
    await prisma.socialPost.update({
      where: { id: post.id },
      data: { lastPostedAt: new Date() },
    });

    return NextResponse.json({ success: true, postId: post.id, order: post.order, results });
  } catch (err) {
    console.error("Social post error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
