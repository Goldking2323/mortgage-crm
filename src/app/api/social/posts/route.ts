import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.socialPost.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, caption } = await req.json();
  if (!imageUrl || !caption) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const last = await prisma.socialPost.findFirst({ orderBy: { order: "desc" } });
  const order = (last?.order ?? 0) + 1;

  const post = await prisma.socialPost.create({ data: { imageUrl, caption, order } });
  return NextResponse.json(post, { status: 201 });
}
