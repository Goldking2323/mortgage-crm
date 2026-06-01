"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, PIPELINE_STAGES } from "@/lib/utils";
import { Phone, Mail } from "lucide-react";

type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;
  purchasePrice: number | null;
  status: string;
  createdAt: Date;
};

type Column = {
  key: string;
  label: string;
  color: string;
  leads: Lead[];
};

export function PipelineBoard({ initialColumns }: { initialColumns: Column[] }) {
  const router = useRouter();
  const [columns, setColumns] = useState(initialColumns);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function onDragStart(leadId: string) {
    setDraggingId(leadId);
  }

  async function onDrop(targetStage: string) {
    if (!draggingId) return;

    const sourceColumn = columns.find((c) => c.leads.some((l) => l.id === draggingId));
    if (!sourceColumn || sourceColumn.key === targetStage) {
      setDraggingId(null);
      return;
    }

    const lead = sourceColumn.leads.find((l) => l.id === draggingId)!;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.key === sourceColumn.key) return { ...col, leads: col.leads.filter((l) => l.id !== draggingId) };
        if (col.key === targetStage) return { ...col, leads: [{ ...lead, status: targetStage }, ...col.leads] };
        return col;
      })
    );
    setDraggingId(null);

    await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: draggingId, status: targetStage }),
    });

    router.refresh();
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
      {columns.map((col) => (
        <div
          key={col.key}
          className="flex flex-col min-w-[220px] w-[220px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(col.key)}
        >
          {/* Column header */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border ${col.color} mb-2`}>
            <span className="text-xs font-semibold">{col.label}</span>
            <span className="text-xs font-bold">{col.leads.length}</span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2 flex-1 min-h-[200px] bg-slate-100 rounded-b-lg p-2">
            {col.leads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={() => onDragStart(lead.id)}
                className={`bg-white rounded-lg border border-slate-200 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                  draggingId === lead.id ? "opacity-40" : ""
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">
                  {lead.firstName} {lead.lastName}
                </p>
                <p className="text-xs text-slate-400 capitalize mt-0.5">
                  {lead.propertyType.toLowerCase().replace("_", " ")}
                </p>
                {lead.purchasePrice && (
                  <p className="text-xs text-slate-500 mt-1">{formatCurrency(lead.purchasePrice)}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <a href={`tel:${lead.phone}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Phone className="w-3 h-3" />
                  </a>
                  <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Mail className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
            {col.leads.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-slate-400">Drop here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
