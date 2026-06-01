"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

export function FollowUpToggle({ id, completed }: { id: string; completed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch("/api/followups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`mt-0.5 shrink-0 transition-colors ${
        completed ? "text-green-500" : "text-slate-300 hover:text-green-500"
      } disabled:opacity-50`}
    >
      {completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
    </button>
  );
}
