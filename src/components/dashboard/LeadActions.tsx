"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PIPELINE_STAGES } from "@/lib/utils";
import { ChevronDown, UserPlus } from "lucide-react";
import Link from "next/link";

interface Props {
  leadId: string;
  currentStatus: string;
  hasContact: boolean;
}

export function LeadActions({ leadId, currentStatus, hasContact }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function changeStatus(status: string) {
    setUpdating(true);
    await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, status }),
    });
    router.refresh();
    setUpdating(false);
  }

  async function createContact() {
    setUpdating(true);
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    });
    router.refresh();
    setUpdating(false);
  }

  return (
    <div className="flex items-center gap-2">
      {!hasContact && (
        <button
          onClick={createContact}
          disabled={updating}
          title="Create contact profile"
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          <UserPlus className="w-3.5 h-3.5" />
        </button>
      )}
      {hasContact && (
        <Link href={`/contacts/${leadId}`} className="text-xs text-blue-600 hover:underline">
          View
        </Link>
      )}
      <div className="relative group">
        <button
          disabled={updating}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-50"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className="absolute right-0 top-5 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-36 hidden group-hover:block">
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage.key}
              onClick={() => changeStatus(stage.key)}
              disabled={stage.key === currentStatus}
              className="block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-default"
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
