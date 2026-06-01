import { prisma } from "@/lib/prisma";
import { formatDate, formatPhone } from "@/lib/utils";
import { FollowUpToggle } from "@/components/dashboard/FollowUpToggle";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const followUps = await prisma.followUp.findMany({
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
    include: {
      contact: {
        include: { lead: { select: { id: true, firstName: true, lastName: true, phone: true } } },
      },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pending = followUps.filter((f) => !f.completed);
  const done = followUps.filter((f) => f.completed);

  const overdue = pending.filter((f) => new Date(f.dueDate) < today);
  const upcoming = pending.filter((f) => new Date(f.dueDate) >= today);

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <CalendarCheck className="w-6 h-6 text-slate-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-Ups</h1>
          <p className="text-slate-500 text-sm">{pending.length} pending · {overdue.length} overdue</p>
        </div>
      </div>

      {overdue.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">Overdue</h2>
          <div className="space-y-2">
            {overdue.map((fu) => <FollowUpRow key={fu.id} fu={fu} overdue />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.map((fu) => <FollowUpRow key={fu.id} fu={fu} />)}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Completed</h2>
          <div className="space-y-2 opacity-60">
            {done.slice(0, 10).map((fu) => <FollowUpRow key={fu.id} fu={fu} />)}
          </div>
        </section>
      )}

      {followUps.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No follow-ups yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Add follow-ups from a{" "}
            <Link href="/contacts" className="text-blue-600 hover:underline">contact profile</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

function FollowUpRow({
  fu,
  overdue = false,
}: {
  fu: { id: string; title: string; dueDate: Date; description: string | null; completed: boolean; contact: { id: string; lead: { id: string; firstName: string; lastName: string; phone: string } } };
  overdue?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border bg-white ${overdue ? "border-red-200" : "border-slate-200"}`}>
      <FollowUpToggle id={fu.id} completed={fu.completed} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${fu.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
          {fu.title}
        </p>
        {fu.description && <p className="text-xs text-slate-400 mt-0.5">{fu.description}</p>}
        <div className="flex items-center gap-3 mt-1.5">
          <Link
            href={`/contacts/${fu.contact.lead.id}`}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            {fu.contact.lead.firstName} {fu.contact.lead.lastName}
          </Link>
          <span className="text-xs text-slate-400">{formatPhone(fu.contact.lead.phone)}</span>
          <span className={`text-xs ${overdue ? "text-red-600 font-medium" : "text-slate-400"}`}>
            Due {formatDate(fu.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
