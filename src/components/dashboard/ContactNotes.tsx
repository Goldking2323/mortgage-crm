"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";

type Note = { id: string; createdAt: Date; content: string; type: string };

const NOTE_TYPES = [
  { value: "general", label: "General" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
];

const TYPE_COLORS: Record<string, string> = {
  general: "bg-slate-100 text-slate-600",
  call: "bg-blue-100 text-blue-700",
  email: "bg-purple-100 text-purple-700",
  meeting: "bg-green-100 text-green-700",
};

export function ContactNotes({ contactId, notes }: { contactId: string; notes: Note[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");
  const [saving, setSaving] = useState(false);

  async function addNote() {
    if (!content.trim()) return;
    setSaving(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, content, type }),
    });
    setContent("");
    setType("general");
    setOpen(false);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800">Notes</h2>
          <span className="text-xs text-slate-400">({notes.length})</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add note
        </button>
      </div>

      {open && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex gap-2">
            {NOTE_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                  type === t.value ? TYPE_COLORS[t.value] : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={addNote}
              disabled={saving || !content.trim()}
              className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save note"}
            </button>
            <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 && !open ? (
        <p className="text-slate-400 text-sm">No notes yet. Add your first note above.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border-l-2 border-slate-200 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[note.type] ?? "bg-slate-100 text-slate-600"}`}>
                  {note.type}
                </span>
                <span className="text-xs text-slate-400">{formatDate(note.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
