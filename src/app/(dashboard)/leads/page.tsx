import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatPhone, PIPELINE_STAGES } from "@/lib/utils";
import { LeadActions } from "@/components/dashboard/LeadActions";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: { select: { id: true } } },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Inbox</h1>
          <p className="text-slate-500 text-sm mt-1">{leads.length} total leads</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400">No leads yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              Share your{" "}
              <Link href="/" className="text-blue-600 hover:underline" target="_blank">
                landing page <ExternalLink className="inline w-3 h-3" />
              </Link>{" "}
              to start collecting leads.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Name", "Contact", "Type", "Price / Down", "Credit", "Status", "Received", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const stage = PIPELINE_STAGES.find((s) => s.key === lead.status);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <p>{lead.email}</p>
                        <p className="text-xs">{formatPhone(lead.phone)}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 capitalize whitespace-nowrap">
                        {lead.propertyType.toLowerCase().replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <p>{formatCurrency(lead.purchasePrice)}</p>
                        {lead.downPayment && <p className="text-xs">{formatCurrency(lead.downPayment)} down</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 capitalize whitespace-nowrap">
                        {lead.creditRange.toLowerCase()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${stage?.color}`}>
                          {stage?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <LeadActions leadId={lead.id} currentStatus={lead.status} hasContact={!!lead.contact} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
