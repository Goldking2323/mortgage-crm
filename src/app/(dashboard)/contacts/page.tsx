import { prisma } from "@/lib/prisma";
import { formatDate, formatPhone } from "@/lib/utils";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead: true,
      followUps: { where: { completed: false } },
      notes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
        <p className="text-slate-500 text-sm mt-1">{contacts.length} contact profiles</p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No contacts yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Open a lead from the{" "}
            <Link href="/leads" className="text-blue-600 hover:underline">Leads Inbox</Link>{" "}
            and click the person icon to create a contact profile.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts/${contact.leadId}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {contact.lead.firstName[0]}{contact.lead.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {contact.lead.firstName} {contact.lead.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{formatPhone(contact.lead.phone)}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>{contact.lead.email}</p>
                <p className="capitalize">{contact.lead.propertyType.toLowerCase().replace("_", " ")} · {contact.lead.status.replace("_", " ")}</p>
                {contact.employer && <p>Employer: {contact.employer}</p>}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{contact.followUps.length} pending follow-ups</span>
                <span className="text-xs text-slate-400">Added {formatDate(contact.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
