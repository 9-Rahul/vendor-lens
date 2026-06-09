import { Requirement } from "@/types/assessment";

interface RequirementListProps {
  requirements: Requirement[];
  selectedReqId: string;
  onSelect: (id: string) => void;
}

export function RequirementList({ requirements, selectedReqId, onSelect }: RequirementListProps) {
  const grouped = requirements.reduce((acc, req) => {
    if (!acc[req.category]) acc[req.category] = [];
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, Requirement[]>);

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([category, reqs]) => (
        <div key={category}>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-3 pb-1 border-b border-[var(--color-outline-variant)]/40">
            {category}
          </h3>
          <div className="flex flex-col gap-2">
            {reqs.map((req) => {
              const isSelected = selectedReqId === req.id;
              
              let statusColorClass = "";
              let statusBgClass = "";
              
              switch (req.status) {
                case "met":
                  statusColorClass = "text-[var(--color-status-met)]";
                  statusBgClass = "bg-[var(--color-status-met)]";
                  break;
                case "missing":
                  statusColorClass = "text-[var(--color-status-missing)]";
                  statusBgClass = "bg-[var(--color-status-missing)]";
                  break;
                case "partial":
                default:
                  statusColorClass = "text-[var(--color-tertiary-container)]";
                  statusBgClass = "bg-[var(--color-tertiary-container)]";
                  break;
              }

              return (
                <button
                  key={req.id}
                  onClick={() => onSelect(req.id)}
                  className={`w-full text-left p-3 rounded-md cursor-pointer relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)] ${
                    isSelected
                      ? `border border-[var(--color-outline-variant)] shadow-sm ${statusBgClass}/5`
                      : "border border-[var(--color-outline-variant)]/40 hover:bg-[var(--color-surface-container-low)]"
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${statusBgClass}`} />
                  )}
                  <div className={`text-[10px] font-bold mb-1 uppercase ${statusColorClass}`}>
                    {req.code} • {req.status}
                  </div>
                  <div className="text-[13px] font-medium text-[var(--color-on-surface)]">
                    {req.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
