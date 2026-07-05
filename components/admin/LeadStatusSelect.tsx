"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/admin";
import { Select } from "@/components/ui/Select";

const STATUSES = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["appointment", "Appointment set"],
  ["sold", "Sold"],
  ["lost", "Lost"],
] as const;

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="w-48" data-pending={pending || undefined}>
      <Select
        label="Status"
        name={`status-${id}`}
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const data = new FormData();
          data.set("id", id);
          data.set("status", e.target.value);
          startTransition(() => updateLeadStatus(data));
        }}
      >
        {STATUSES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
