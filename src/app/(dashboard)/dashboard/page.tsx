import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Inbox, Users, CalendarCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalLeads, newLeads, contacts, pendingFollowUps, fundedLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.contact.count(),
    prisma.followUp.count({ where: { completed: false } }),
    prisma.lead.findMany({ where: { status: "FUNDED" }, select: { purchasePrice: true } }),
  ]);

  const fundedVolume = fundedLeads.reduce((sum: number, l: { purchasePrice: number | null }) => sum + (l.purchasePrice ?? 0), 0);

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      propertyType: true,
      purchasePrice: true,
      status: true,
      createdAt: true,
    },
  });

  const stats = [
    { label: "Total Leads", value: totalLeads, sub: `${newLeads} new`, icon: Inbox, color: "text-blue-600 bg-blue-50" },
    { label: "Contacts", value: contacts, sub: "full profiles", icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Follow-Ups Due", value: pendingFollowUps, sub: "pending", icon: CalendarCheck, color: "text-orange-600 bg-orange-50" },
    { label: "Funded Volume", value: formatCurrency(fundedVolume), sub: `${fundedLeads.length} deals`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back. Here&apos;s your pipeline at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Leads</h2>
          <Link href="/leads" className="text-blue-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentLeads.length === 0 && (
            <p className="px-6 py-8 text-slate-400 text-sm text-center">No leads yet. Share your landing page to start collecting leads.</p>
          )}
          {recentLeads.map((lead) => (
            <div key={lead.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">{lead.firstName} {lead.lastName}</p>
                <p className="text-xs text-slate-400">{lead.email} · {lead.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 capitalize">{lead.propertyType.toLowerCase().replace("_", " ")}</p>
                {lead.purchasePrice && <p className="text-xs text-slate-400">{formatCurrency(lead.purchasePrice)}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                lead.status === "NEW" ? "bg-slate-100 text-slate-600" :
                lead.status === "FUNDED" ? "bg-green-100 text-green-700" :
                lead.status === "LOST" ? "bg-red-100 text-red-600" :
                "bg-blue-100 text-blue-700"
              }`}>
                {lead.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
