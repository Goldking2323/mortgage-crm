import { prisma } from "@/lib/prisma";
import { PIPELINE_STAGES } from "@/lib/utils";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
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

  const columns = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    leads: leads.filter((l) => l.status === stage.key),
  }));

  return (
    <div className="p-8 space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
        <p className="text-slate-500 text-sm mt-1">Drag cards to move leads through stages.</p>
      </div>
      <PipelineBoard initialColumns={columns} />
    </div>
  );
}
