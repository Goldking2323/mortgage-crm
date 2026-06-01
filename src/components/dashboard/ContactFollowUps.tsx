"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { CalendarCheck, Plus, CheckCircle, Circle } from "lucide-react";

type FollowUp = {
  id: string;
  dueDate: Date;
  title: string;
  description: string | null;
  completed: boolean;
};

export function ContactFollowUps({ contactId, followUps }: { contactId: string; followUps: FollowUp[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function addFollowUp() {
    if (!title.trim() || !dueDate) return;
    setSaving(true);
    await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, title, dueDate, description }),
    });
    setTitle("");
    setDueDate("");
    setDescription("");
    setOpen(false);
    setSaving(false);
    router.refresh();
  }

  async function toggleComplete(id: string, completed: boolean) {
    await fetch("/api/followups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    router.refresh();
  }

  const pending = followUps.filter((f) => !f.completed);
  const done = followUps.filter((f) => f.completed);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800">Follow-Ups</h2>
          <span className="text-xs text-slate-400">({pending.length} pending)</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {open && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Follow-up title (e.g. Send rate sheet)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details (optional)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={addFollowUp}
              disabled={saving || !title.trim() || !dueDate}
              className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {pending.map((fu) => (
          <div key={fu.id} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
            <button onClick={() => toggleComplete(fu.id, fu.completed)} className="mt-0.5 text-orange-400 hover:text-green-600 transition-colors shrink-0">
              <Circle className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{fu.title}</p>
              {fu.description && <p className="text-xs text-slate-500 mt-0.5">{fu.description}</p>}
              <p className="text-xs text-orange-600 mt-1">Due {formatDate(fu.dueDate)}</p>
            </div>
          </div>
        ))}
        {done.map((fu) => (
          <div key={fu.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 opacity-60">
            <button onClick={() => toggleComplete(fu.id, fu.completed)} className="mt-0.5 text-green-500 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </button>
            <div>
              <p className="text-sm text-slate-500 line-through">{fu.title}</p>
            </div>
          </div>
        ))}
        {followUps.length === 0 && !open && (
          <p className="text-slate-400 text-sm">No follow-ups yet.</p>
        )}
      </div>
    </div>
  );
}
