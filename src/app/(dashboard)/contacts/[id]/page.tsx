import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, formatPhone, PIPELINE_STAGES } from "@/lib/utils";
import { ContactNotes } from "@/components/dashboard/ContactNotes";
import { ContactFollowUps } from "@/components/dashboard/ContactFollowUps";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      contact: {
        include: {
          notes: { orderBy: { createdAt: "desc" } },
          followUps: { orderBy: { dueDate: "asc" } },
        },
      },
    },
  });

  if (!lead || !lead.contact) notFound();

  const contact = lead.contact;
  const stage = PIPELINE_STAGES.find((s) => s.key === lead.status);

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/contacts" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {lead.firstName} {lead.lastName}
          </h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${stage?.color}`}>
            {stage?.label}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — profile */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Contact Info</h2>
            <div className="space-y-3 text-sm">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                <Phone className="w-4 h-4" />
                {formatPhone(lead.phone)}
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                <Mail className="w-4 h-4" />
                {lead.email}
              </a>
              {lead.message && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-slate-500 text-xs font-medium mb-1">Initial Message</p>
                  <p className="text-slate-600 text-xs leading-relaxed">{lead.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Mortgage Details</h2>
            <dl className="space-y-2 text-sm">
              {[
                { label: "Type", value: lead.propertyType.replace("_", " ") },
                { label: "Purchase Price", value: formatCurrency(lead.purchasePrice) },
                { label: "Down Payment", value: formatCurrency(lead.downPayment) },
                { label: "Credit Range", value: lead.creditRange },
                { label: "Employment", value: lead.employment || "—" },
                { label: "Referred By", value: lead.referredBy || "—" },
                { label: "Lead Source", value: lead.source },
                { label: "Received", value: formatDate(lead.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-slate-400 capitalize">{label}</dt>
                  <dd className="text-slate-700 font-medium capitalize text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {(contact.employer || contact.annualIncome || contact.monthlyDebts) && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Financial Profile</h2>
              <dl className="space-y-2 text-sm">
                {contact.employer && <div className="flex justify-between"><dt className="text-slate-400">Employer</dt><dd className="text-slate-700">{contact.employer}</dd></div>}
                {contact.annualIncome && <div className="flex justify-between"><dt className="text-slate-400">Annual Income</dt><dd className="text-slate-700">{formatCurrency(contact.annualIncome)}</dd></div>}
                {contact.monthlyDebts && <div className="flex justify-between"><dt className="text-slate-400">Monthly Debts</dt><dd className="text-slate-700">{formatCurrency(contact.monthlyDebts)}</dd></div>}
              </dl>
            </div>
          )}
        </div>

        {/* Right — notes + follow-ups */}
        <div className="lg:col-span-2 space-y-4">
          <ContactNotes contactId={contact.id} notes={contact.notes} />
          <ContactFollowUps contactId={contact.id} followUps={contact.followUps} />
        </div>
      </div>
    </div>
  );
}
