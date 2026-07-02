"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Send } from "lucide-react";

interface SocialPost {
  id: string;
  order: number;
  imageUrl: string;
  caption: string;
  active: boolean;
  lastPostedAt: string | null;
}

export default function SocialPostsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/social/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addPost() {
    if (!newImageUrl || !newCaption) return;
    setSaving(true);
    await fetch("/api/social/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: newImageUrl, caption: newCaption }),
    });
    setNewImageUrl("");
    setNewCaption("");
    setSaving(false);
    load();
  }

  async function togglePost(id: string, active: boolean) {
    await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    load();
  }

  async function deletePost(id: string) {
    await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
    load();
  }

  async function triggerPost() {
    setPosting(true);
    setMessage("");
    const res = await fetch("/api/social/post", { method: "POST" });
    const data = await res.json();
    setMessage(data.success ? `Posted successfully (post #${data.order})` : `Error: ${data.error || data.message}`);
    setPosting(false);
    load();
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Social Posts</h1>
          <p className="text-stone-400 text-sm mt-1">Manage your rotating post queue for Facebook & Instagram</p>
        </div>
        <button
          onClick={triggerPost}
          disabled={posting}
          className="flex items-center gap-2 bg-[#8B7355] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7a6348] transition disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {posting ? "Posting..." : "Post Next Now"}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message}
        </div>
      )}

      {/* Add new post */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-stone-700 mb-3">Add New Post</h2>
        <div className="space-y-3">
          <input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Image URL (must be a public https:// link)"
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
          />
          <textarea
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption + hashtags..."
            rows={4}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355] resize-none"
          />
          <button
            onClick={addPost}
            disabled={saving || !newImageUrl || !newCaption}
            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-700 transition disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Saving..." : "Add to Queue"}
          </button>
        </div>
      </div>

      {/* Post list */}
      {loading ? (
        <p className="text-stone-400 text-sm">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-stone-400 text-sm">No posts yet. Add your first one above.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className={`bg-white border rounded-xl p-4 flex gap-4 items-start ${post.active ? "border-stone-200" : "border-stone-100 opacity-50"}`}>
              <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-100" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-stone-500 mb-1">Post #{post.order}</p>
                <p className="text-sm text-stone-700 line-clamp-2">{post.caption}</p>
                {post.lastPostedAt && (
                  <p className="text-xs text-stone-400 mt-1">Last posted: {new Date(post.lastPostedAt).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePost(post.id, post.active)} className="text-stone-400 hover:text-[#8B7355] transition">
                  {post.active ? <ToggleRight className="w-5 h-5 text-[#8B7355]" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => deletePost(post.id)} className="text-stone-400 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
